'use client';

import { Role } from '@/utils/Utils';
import { useSession } from 'next-auth/react';
 

export function useRole() {
  const { data: session, status } = useSession();
  // eslint-disable-next-line
  const userRole = (session?.user as any)?.role as Role | undefined;
  
  const hasRole = (requiredRoles: Role | Role[]): boolean => {
    if (!userRole) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
  };
  
  const isAdmin = (): boolean => hasRole(Role.Admin);
  const isModerator = (): boolean => hasRole(Role.Moderator);
  const isScholar = (): boolean => hasRole(Role.Scholar);
  
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
