/**
 * Sentry Configuration
 * Error monitoring, performance tracking, and observability
 * Phase 1: Database & Monitoring Implementation
 */

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

/**
 * Initialize Sentry for React application
 * Captures errors, tracks performance, and monitors user sessions
 */
export function initializeSentry() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  if (!process.env.REACT_APP_SENTRY_DSN) {
    console.warn("Sentry DSN not configured. Error monitoring disabled.");
    return;
  }

  Sentry.init({
    // DSN (Data Source Name) for Sentry project
    dsn: process.env.REACT_APP_SENTRY_DSN,

    // Environment (development, staging, production)
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Release version
    release: process.env.REACT_APP_VERSION || "unknown",

    // Performance monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    tracePropagationTargets: [
      "localhost",
      /^\//,
      /^https:\/\/[^/]*\.example\.com\/api/i,
    ],

    // Session replay (captures user interactions for debugging)
    integrations: [
      new BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: ["localhost", /^\//],
        // Capture interactions
        shouldCreateSpanForRequest: (url) => {
          return !url.includes("/health");
        },
      }),
      new Sentry.Replay({
        // Mask sensitive data
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Session replay sampling
    replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Random plugins/extensions
      "chrome-extension://",
      "moz-extension://",
      // Network errors (usually not actionable)
      "NetworkError",
      "Network request failed",
      // User cancelled
      "AbortError",
    ],

    // Before sending event to Sentry
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Ignore specific error types
          if (error.message.includes("ResizeObserver loop")) {
            return null;
          }
        }
      }
      return event;
    },

    // Attach stack traces
    attachStacktrace: true,

    // Max breadcrumbs to track
    maxBreadcrumbs: 50,

    // Breadcrumb filtering
    beforeBreadcrumb(breadcrumb) {
      // Filter out certain breadcrumbs
      if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
        return null;
      }
      return breadcrumb;
    },

    // Debug mode (set to true in development)
    debug: isDevelopment,
  });

  // Set user context if authenticated
  setUserContext();

  // Track page views
  trackPageView();
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId?: string, email?: string, username?: string) {
  if (userId) {
    Sentry.setUser({
      id: userId,
      email,
      username,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Track page views for analytics
 */
export function trackPageView() {
  // This will be called by router integration
  Sentry.captureMessage("Page view", "info");
}

/**
 * Capture exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext("additional", context);
  }
  Sentry.captureException(error);
}

/**
 * Capture message with level
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category: string = "user-action",
  level: Sentry.SeverityLevel = "info"
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a transaction for performance monitoring
 */
export function startTransaction(name: string, op: string = "http.request") {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Sentry configuration object for export
 */
export const sentryConfig = {
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
};

export default Sentry;
