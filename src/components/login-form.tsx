'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { signIn, isLoading, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/config');
    }
  }, [isAuthenticated, router]); // Include dependencies

  // Clear errors when form values change
  useEffect(() => {
    if (error) {
      clearError();
    }
    setEmailError('');
    setPasswordError('');
  }, [email, password, error, clearError]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await signIn({ email, password });
    
    if (success) {
      console.log('Login successful - redirecting to config page');
      // Redirect immediately after successful login
      router.push('/config');
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-4">
          {/* Email Field */}
          <div className="flex flex-column gap-2">
            <label htmlFor="email" className="text-sm font-medium text-700">
              Email Address
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={emailError ? 'p-invalid' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
            {emailError && (
              <small className="text-red-500">{emailError}</small>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-column gap-2">
            <label htmlFor="password" className="text-sm font-medium text-700">
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={passwordError ? 'p-invalid' : ''}
              disabled={isLoading}
              feedback={false}
              toggleMask
              autoComplete="current-password"
            />
            {passwordError && (
              <small className="text-red-500">{passwordError}</small>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Message severity="error" text={error} />
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            label={isLoading ? 'Signing In...' : 'Sign In'}
            icon="pi pi-sign-in"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          />

          <Divider />

          {/* Navigation Links */}
          <div className="text-center">
            <div className="flex flex-column gap-2">
              <Link href="/config">
                <Button
                  label="Continue as Guest"
                  icon="pi pi-user"
                  outlined
                  size="small"
                  className="w-full"
                />
              </Link>
              <Link href="/">
                <Button
                  label="Back to Home"
                  icon="pi pi-home"
                  link
                  size="small"
                  className="w-full"
                />
              </Link>
            </div>
          </div>

          {/* Demo Info */}
          <div className="surface-100 border-round p-3">
            <h4 className="text-sm font-medium text-700 mb-2 m-0">Demo Information</h4>
            <p className="text-xs text-600 mb-2 m-0">
              This login form connects to the STC API at localhost:4000.
              Authentication tokens are stored in localStorage and maintained across page reloads.
            </p>
            <p className="text-xs text-600 m-0">
              <strong>Note:</strong> Make sure the backend API is running to test authentication.
            </p>
          </div>
        </div>
      </form>
    </Card>
  );
}