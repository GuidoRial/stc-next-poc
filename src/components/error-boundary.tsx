'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen surface-50 p-4 flex align-items-center justify-content-center">
          <Card className="max-w-30rem">
            <Message
              severity="error"
              content={
                <div>
                  <h3 className="font-medium text-red-800 mb-2 m-0">Application Error</h3>
                  <p className="text-sm text-red-700 mb-3 m-0">
                    Something went wrong. Please refresh the page or try again.
                  </p>
                  {this.state.error && (
                    <details className="text-xs text-red-600">
                      <summary className="cursor-pointer mb-2">Error Details</summary>
                      <pre className="overflow-auto">{this.state.error.message}</pre>
                    </details>
                  )}
                </div>
              }
            />
            <div className="flex justify-content-center mt-4">
              <Button
                label="Reload Page"
                icon="pi pi-refresh"
                onClick={() => window.location.reload()}
              />
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;