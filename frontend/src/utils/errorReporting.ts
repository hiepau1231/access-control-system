import { ErrorInfo } from 'react';

interface ErrorDetails {
  error: Error;
  errorInfo?: ErrorInfo;
  context?: Record<string, any>;
  user?: {
    id?: string;
    username?: string;
  };
  timestamp?: string;
}

class ErrorReporting {
  private static instance: ErrorReporting;
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): ErrorReporting {
    if (!ErrorReporting.instance) {
      ErrorReporting.instance = new ErrorReporting();
    }
    return ErrorReporting.instance;
  }

  public initialize() {
    if (this.isInitialized) return;

    // Set up global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError({
        error: error || new Error(message as string),
        context: { source, lineno, colno }
      });
    };

    // Set up unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      this.logError({
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        context: { type: 'unhandledRejection' }
      });
    };

    this.isInitialized = true;
  }

  public logError(details: ErrorDetails) {
    const {
      error,
      errorInfo,
      context,
      user,
      timestamp = new Date().toISOString()
    } = details;

    // Prepare error report
    const errorReport = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      context,
      user,
      timestamp,
      environment: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Report');
      console.error('Error:', error);
      if (errorInfo) console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // In production, you would send this to your error reporting service
    // Example with a hypothetical error reporting service:
    if (process.env.NODE_ENV === 'production') {
      // TODO: Replace with actual error reporting service
      // errorReportingService.send(errorReport);
      
      // For now, just log to console
      console.error('[Error Report]:', errorReport);
    }
  }

  public getErrorMessage(error: Error): string {
    // Common error messages mapping
    const errorMessages: Record<string, string> = {
      'Failed to fetch': 'Network error. Please check your internet connection.',
      'Network Error': 'Unable to connect to the server. Please try again later.',
      'Unauthorized': 'Your session has expired. Please log in again.',
      'Permission denied': 'You don\'t have permission to perform this action.',
    };

    // Check if we have a predefined message for this error
    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.message.includes(key)) {
        return message;
      }
    }

    // Return a user-friendly message for unknown errors
    return process.env.NODE_ENV === 'development'
      ? error.message
      : 'An unexpected error occurred. Please try again later.';
  }

  public handleError(error: Error, errorInfo?: ErrorInfo) {
    this.logError({ error, errorInfo });
    return this.getErrorMessage(error);
  }
}

// Export singleton instance
export const errorReporting = ErrorReporting.getInstance();

// Export helper functions
export const logError = (error: Error, context?: Record<string, any>) => {
  errorReporting.logError({ error, context });
};

export const getErrorMessage = (error: Error): string => {
  return errorReporting.getErrorMessage(error);
};

export const handleError = (error: Error, errorInfo?: ErrorInfo): string => {
  return errorReporting.handleError(error, errorInfo);
};