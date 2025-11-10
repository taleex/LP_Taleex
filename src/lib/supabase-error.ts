import type { QueryKey } from "@tanstack/react-query";

export const SUPABASE_ERROR_EVENT = "supabase:error";
const STORAGE_KEY = "lp_taleex.supabaseErrorReported";

export interface SupabaseErrorMeta {
  source?: string;
  queryKey?: QueryKey;
  details?: Record<string, unknown>;
}

export interface SupabaseErrorPayload {
  message: string;
  stack?: string;
  code?: string;
  timestamp: string;
  url?: string;
  meta?: SupabaseErrorMeta;
}

let hasReportedInSession = false;

const markReported = () => {
  hasReportedInSession = true;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      console.warn("Unable to persist Supabase error flag", error);
    }
  }
};

const alreadyReported = () => {
  if (hasReportedInSession) return true;
  if (typeof window === "undefined") return false;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      hasReportedInSession = true;
      return true;
    }
  } catch (error) {
    console.warn("Unable to read Supabase error flag", error);
  }
  return false;
};

export const isSupabaseError = (error: unknown) => {
  if (!error) return false;

  const normalizedMessage =
    typeof error === "string"
      ? error
      : typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message)
        : undefined;

  const code =
    typeof error === "object" && "code" in error
      ? String((error as { code?: string }).code)
      : undefined;

  const message = normalizedMessage?.toLowerCase();

  return Boolean(
    code === "PGRST" ||
      code === "42P01" || // missing table
      message?.includes("supabase") ||
      message?.includes("postgrest") ||
      message?.includes("database") ||
      message?.includes("fetch failed") ||
      message?.includes("failed to fetch")
  );
};

const buildPayload = (
  error: unknown,
  meta?: SupabaseErrorMeta
): SupabaseErrorPayload => {
  const timestamp = new Date().toISOString();
  const url =
    typeof window !== "undefined" ? window.location.href : undefined;

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as { code?: string }).code,
      timestamp,
      url,
      meta,
    };
  }

  if (typeof error === "object" && error !== null) {
    return {
      message: JSON.stringify(error),
      code: (error as { code?: string }).code,
      timestamp,
      url,
      meta,
    };
  }

  return {
    message: String(error),
    timestamp,
    url,
    meta,
  };
};

const sendSupabaseErrorReport = async (payload: SupabaseErrorPayload) => {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.functions.invoke("send-error-report", {
      body: payload,
    });
  } catch (reportError) {
    console.error("Failed to submit Supabase outage report", reportError);
  }
};

export const notifySupabaseError = (
  error: unknown,
  meta?: SupabaseErrorMeta
) => {
  if (!isSupabaseError(error)) return;

  const payload = buildPayload(error, meta);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<SupabaseErrorPayload>(SUPABASE_ERROR_EVENT, {
        detail: payload,
      })
    );
  }

  if (alreadyReported()) return;
  markReported();
  void sendSupabaseErrorReport(payload);
};
