import React from "react";

/**
 * A full-page loader that displays a spinning ring and a pulsing dot,
 * along with a message to the user to wait a moment.
 *
 * @returns {React.ReactElement} A full-page loader component.
 */
export const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500 mx-auto"></div>
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-300 font-medium">Loading articles...</p>
        <p className="mt-1 text-gray-500 text-sm">Please wait a moment</p>
      </div>
    </div>
  );
};

// Default export
export default FullPageLoader;
