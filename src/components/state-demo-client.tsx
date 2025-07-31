'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { configAtom } from '@/store/config';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import Link from 'next/link';

export default function StateDemoClient() {
  const [config] = useAtom(configAtom);
  const [mounted, setMounted] = useState(false);
  const [stateLog, setStateLog] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    
    // Log the current global state
    const currentState = {
      timestamp: new Date().toISOString(),
      configData: config.config,
      isLoading: config.isLoading,
      error: config.error,
      hasData: !!config.config
    };
    
    const logEntry = JSON.stringify(currentState, null, 2);
    setStateLog(logEntry);
    
    console.log('[State Demo] Current global state:', currentState);
  }, [config]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  if (!mounted) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <p className="text-600">Loading state demo...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-column gap-4">
      {/* Navigation */}
      <Card className="p-4">
        <div className="flex justify-content-between align-items-center">
          <h2 className="text-2xl font-semibold text-900 m-0">
            Global State Test
          </h2>
          <Link href="/config">
            <Button 
              label="Back to Config" 
              icon="pi pi-arrow-left" 
              outlined
            />
          </Link>
        </div>
      </Card>

      {/* State Information */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-900 mb-3">Current Global State</h3>
        
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="surface-100 p-3 border-round">
              <label className="block text-sm font-medium text-700 mb-2">Has Config Data</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold border-round ${
                config.config 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {config.config ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          <div className="col-12 md:col-6">
            <div className="surface-100 p-3 border-round">
              <label className="block text-sm font-medium text-700 mb-2">Loading State</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold border-round ${
                config.isLoading 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {config.isLoading ? 'Loading' : 'Idle'}
              </span>
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="surface-100 p-3 border-round">
              <label className="block text-sm font-medium text-700 mb-2">Error State</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold border-round ${
                config.error 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {config.error ? 'Has Error' : 'No Error'}
              </span>
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="surface-100 p-3 border-round">
              <label className="block text-sm font-medium text-700 mb-2">Config Keys Count</label>
              <p className="text-lg text-900 m-0">
                {config.config ? Object.keys(config.config).length : 0}
              </p>
            </div>
          </div>
        </div>

        {config.config && (
          <>
            <Divider />
            <h4 className="text-md font-medium text-900 mb-3">Sample Config Values</h4>
            <div className="grid">
              <div className="col-12 md:col-4">
                <div className="surface-100 p-3 border-round">
                  <label className="block text-sm font-medium text-700 mb-2">App Name</label>
                  <p className="text-sm text-900 m-0">
                    {config.config.appName || 'Not available'}
                  </p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="surface-100 p-3 border-round">
                  <label className="block text-sm font-medium text-700 mb-2">Version</label>
                  <p className="text-sm text-900 m-0">
                    {config.config.version || 'Not available'}
                  </p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="surface-100 p-3 border-round">
                  <label className="block text-sm font-medium text-700 mb-2">Environment</label>
                  <p className="text-sm text-900 m-0">
                    {config.config.environment || 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* State Logging */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-900 mb-3">State Log (JSON)</h3>
        <div className="surface-100 border-round p-4">
          <pre className="text-sm text-700 overflow-auto white-space-pre-wrap m-0" style={{ maxHeight: '300px' }}>
            {stateLog}
          </pre>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-900 mb-3">Test State Persistence</h3>
        
        <Message 
          severity="info" 
          className="mb-4"
          content={
            <div>
              <h4 className="font-medium text-blue-900 mb-2 m-0">How This Demo Works</h4>
              <div className="text-sm text-blue-700">
                <p className="mb-2 m-0">
                  1. The global state is maintained in memory by Jotai during client-side navigation
                </p>
                <p className="mb-2 m-0">
                  2. When you refresh the page, the browser reloads everything and the state is reset
                </p>
                <p className="m-0">
                  3. Click the button below to refresh and see the state reset behavior
                </p>
              </div>
            </div>
          }
        />

        <div className="flex gap-3 flex-wrap">
          <Button
            label="Refresh Page (Lose State)"
            icon="pi pi-refresh"
            severity="warning"
            onClick={handleRefreshPage}
          />
          
          <Link href="/config">
            <Button
              label="Navigate Back (Keep State)"
              icon="pi pi-arrow-left"
              outlined
            />
          </Link>

          <Link href="/">
            <Button
              label="Go to Home (Keep State)"
              icon="pi pi-home"
              outlined
            />
          </Link>
        </div>
      </Card>

      {/* Technical Details */}
      <Card className="surface-100 p-4">
        <h3 className="text-lg font-medium text-900 mb-3">Technical Details</h3>
        <div className="text-sm text-700">
          <h4 className="font-medium text-900 mb-2">State Management Architecture:</h4>
          <ul className="pl-3 mb-3">
            <li className="mb-1">• <strong>Jotai Atoms:</strong> Global state stored in memory</li>
            <li className="mb-1">• <strong>SSR Hydration:</strong> Initial data from server props</li>
            <li className="mb-1">• <strong>Client Navigation:</strong> State persists between route changes</li>
            <li className="mb-1">• <strong>Page Refresh:</strong> State is lost and needs re-initialization</li>
          </ul>
          
          <h4 className="font-medium text-900 mb-2">Current Implementation:</h4>
          <ul className="pl-3">
            <li className="mb-1">• Global config state managed by <code>configAtom</code></li>
            <li className="mb-1">• State initialized from server-side props in <code>/config</code></li>
            <li className="mb-1">• State accessible from any component using <code>useAtom(configAtom)</code></li>
            <li className="mb-1">• No persistence layer (localStorage, sessionStorage, etc.)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}