import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// In-memory rate limiting (simple implementation)
// For production, use Redis or database
const submissionLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 5;

/**
 * Get client identifier from request
 * Uses IP address as fallback if X-Forwarded-For not available
 */
const getClientId = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  // Fallback to a generic identifier if IP not available
  return "unknown-client";
};

/**
 * Check if client has exceeded rate limit
 */
const isRateLimited = (clientId: string): boolean => {
  const now = Date.now();
  const clientSubmissions = submissionLimits.get(clientId) || [];

  // Remove old submissions outside the time window
  const recentSubmissions = clientSubmissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return true;
  }

  // Update the map with recent submissions
  if (recentSubmissions.length > 0) {
    submissionLimits.set(clientId, recentSubmissions);
  }

  return false;
};

/**
 * Record submission for rate limiting
 */
const recordSubmission = (clientId: string): void => {
  const now = Date.now();
  const clientSubmissions = submissionLimits.get(clientId) || [];
  
  // Remove old submissions outside the time window
  const recentSubmissions = clientSubmissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Add current submission
  recentSubmissions.push(now);
  submissionLimits.set(clientId, recentSubmissions);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier for rate limiting
    const clientId = getClientId(req);

    // Check rate limit
    if (isRateLimited(clientId)) {
      return new Response(
        JSON.stringify({
          error: "Too many submissions. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        }),
        {
          status: 429, // Too Many Requests
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW / 1000)),
            ...corsHeaders,
          },
        }
      );
    }

    const { name, email, subject, message }: ContactEmailRequest =
      await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending contact email notification:", { name, email, subject });

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Send notification email to site owner using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["your-email@example.com"], // Replace with actual email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      throw new Error(`Resend API error: ${errorData}`);
    }

    // Record successful submission for rate limiting
    recordSubmission(clientId);

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
