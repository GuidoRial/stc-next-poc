'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AuthStatus() {
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="mb-4">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-spin pi-spinner"></i>
          <span>Loading authentication status...</span>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-4">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-spin pi-spinner"></i>
          <span>Checking authentication...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <div className="flex justify-content-between align-items-start">
        <div>
          <h3 className="text-lg font-medium text-900 mb-3 m-0">Authentication Status</h3>
          <div className="flex flex-column gap-2">
            <div className="flex align-items-center gap-2">
              <span className="text-sm font-medium text-700">Status:</span>
              <Chip 
                label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'} 
                className={`${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              />
            </div>
            
            {isAuthenticated && user && (
              <>
                <div className="flex align-items-center gap-2">
                  <span className="text-sm font-medium text-700">Email:</span>
                  <span className="text-sm text-900">{user.email}</span>
                </div>
                
                {user.firstName && (
                  <div className="flex align-items-center gap-2">
                    <span className="text-sm font-medium text-700">Name:</span>
                    <span className="text-sm text-900">
                      {user.firstName} {user.lastName || ''}
                    </span>
                  </div>
                )}
                
                {user.role && (
                  <div className="flex align-items-center gap-2">
                    <span className="text-sm font-medium text-700">Role:</span>
                    <span className="text-sm text-900 capitalize">{user.role}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-column gap-2">
          {isAuthenticated ? (
            <Button
              label="Sign Out"
              icon="pi pi-sign-out"
              onClick={signOut}
              severity="secondary"
              size="small"
            />
          ) : (
            <Link href="/login">
              <Button
                label="Sign In"
                icon="pi pi-sign-in"
                size="small"
              />
            </Link>
          )}
        </div>
      </div>
      
      <Divider />
      
      <div className="text-xs text-600">
        <p className="mb-2 m-0">
          <strong>Authentication Demo:</strong> This shows the current authentication state managed by Jotai.
        </p>
        <p className="m-0">
          JWT tokens are automatically stored in localStorage and restored on page reload.
        </p>
      </div>
    </Card>
  );
}