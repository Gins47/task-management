import { useEffect } from "react";
import { useGlobalError } from "./GlobalErrorContext "; // Import the context

export const useGlobalErrorHandlers = () => {
  const { showError } = useGlobalError();

  useEffect(() => {
    // Handle uncaught JavaScript errors
    const handleError = (event: ErrorEvent) => {
      showError(`Error: ${event.message}`);
      console.error("Caught by global error handler:", event);
    };

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      showError(`Unhandled Promise Rejection: ${event.reason}`);
      console.error("Unhandled promise rejection:", event);
    };

    // Add global error event listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [showError]); // Re-run the effect only when showError changes
};
