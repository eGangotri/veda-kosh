import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for doesnt exist.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
