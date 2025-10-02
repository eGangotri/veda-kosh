'use client';

import { useSession } from 'next-auth/react';

type UserRole = 'user' | 'admin' | 'moderator' | 'scholar';

export function useRole() {
  const { data: session, status } = useSession();
  // eslint-disable-next-line
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  
  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
  };
  
  const isAdmin = (): boolean => hasRole('admin');
  const isModerator = (): boolean => hasRole(['admin', 'moderator']);
  const isScholar = (): boolean => hasRole(['admin', 'moderator', 'scholar']);
  
  return {
    userRole,
    hasRole,
    isAdmin,
    isModerator,
    isScholar,
    isAuthenticated: !!session,
    isLoading: status === 'loading'
  };
}
