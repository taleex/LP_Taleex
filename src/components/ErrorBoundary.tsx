import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  notifySupabaseError,
  SUPABASE_ERROR_EVENT,
  type SupabaseErrorPayload,
  isSupabaseError,
} from "@/lib/supabase-error";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const SupabaseErrorHandler = ({ children }: ErrorBoundaryProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    const handleBrowserError = (event: ErrorEvent) => {
      if (isSupabaseError(event.error)) {
        notifySupabaseError(event.error, { source: "window.error" });
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isSupabaseError(event.reason)) {
        notifySupabaseError(event.reason, { source: "unhandledrejection" });
      }
    };

    const handleSupabaseEvent = (event: Event) => {
      const detail = (event as CustomEvent<SupabaseErrorPayload>).detail;

      // Reset any ongoing queries so the UI can recover later
      reset();

      if (location.pathname !== "/service-unavailable") {
        console.error("Redirecting to service-unavailable:", detail?.message);
        navigate("/service-unavailable", { replace: true });
      }
    };

    window.addEventListener("error", handleBrowserError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener(
      SUPABASE_ERROR_EVENT,
      handleSupabaseEvent as EventListener
    );

    return () => {
      window.removeEventListener("error", handleBrowserError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener(
        SUPABASE_ERROR_EVENT,
        handleSupabaseEvent as EventListener
      );
    };
  }, [navigate, reset, location.pathname]);

  return <>{children}</>;
};
