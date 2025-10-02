'use client';

import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import { useRole } from '@/hooks/useRole';

export default function AdminPage() {
  const { userRole } = useRole();

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, Administrator!</h2>
            <p className="text-gray-600 mb-4">
              This page is only accessible to users with admin role.
            </p>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Your role: <strong>{userRole}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">Manage user accounts and roles</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Manage Users
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Management</h3>
              <p className="text-gray-600 mb-4">Manage Vedic content and mantras</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Manage Content
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">System Settings</h3>
              <p className="text-gray-600 mb-4">Configure system settings</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
