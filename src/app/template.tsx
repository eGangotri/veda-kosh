import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* This layout wrapper will be re-rendered on navigation */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
