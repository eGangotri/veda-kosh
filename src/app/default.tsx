import React from 'react';

export default function Default() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Veda Kosh</h1>
        <p className="text-gray-600">
          This is the default page shown when no other page matches the URL.
        </p>
      </div>
    </div>
  );
}
