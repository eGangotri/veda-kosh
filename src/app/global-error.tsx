'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
