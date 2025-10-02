'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { userRole } = useRole();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You dont have the required permissions to access this resource.
        </p>
        
        {userRole && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your current role: <span className="font-semibold text-gray-900">{userRole}</span>
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
