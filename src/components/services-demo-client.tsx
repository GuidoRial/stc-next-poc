'use client';

import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import Link from 'next/link';

// Import services
import { 
  configService
} from '@/services';

export default function ServicesDemoClient() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleServiceCall = async (serviceName: string, serviceCall: () => Promise<unknown>) => {
    setLoading(prev => ({ ...prev, [serviceName]: true }));
    setErrors(prev => ({ ...prev, [serviceName]: '' }));
    
    try {
      const result = await serviceCall();
      setResults(prev => ({ ...prev, [serviceName]: result }));
      console.log(`[${serviceName}] Success:`, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [serviceName]: errorMessage }));
      console.error(`[${serviceName}] Error:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [serviceName]: false }));
    }
  };

  const testConfigService = () => {
    handleServiceCall('config', () => configService.getConfig());
  };

  const testConfigValue = () => {
    handleServiceCall('configValue', () => configService.getConfigValue('appName'));
  };

  const renderServiceTest = (
    serviceName: string,
    title: string,
    description: string,
    testFunction: () => void,
    additionalControls?: React.ReactNode
  ) => (
    <Card className="mb-4">
      <div className="flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-900 m-0 mb-2">{title}</h3>
          <p className="text-sm text-600 m-0">{description}</p>
        </div>
        <Button
          label={loading[serviceName] ? 'Testing...' : 'Test Service'}
          icon="pi pi-play"
          onClick={testFunction}
          loading={loading[serviceName]}
          size="small"
        />
      </div>

      {additionalControls}

      {errors[serviceName] && (
        <Message 
          severity="error" 
          text={errors[serviceName]} 
          className="mt-3"
        />
      )}

      {results[serviceName] !== undefined && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-700 mb-2">Response:</label>
          <div className="surface-100 border-round p-3">
            <pre className="text-xs text-700 overflow-auto white-space-pre-wrap m-0" style={{ maxHeight: '200px' }}>
              {typeof results[serviceName] === 'string' 
                ? results[serviceName] as string
                : JSON.stringify(results[serviceName], null, 2)
              }
            </pre>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="flex flex-column gap-4">
      {/* Navigation */}
      <Card className="p-4">
        <div className="flex justify-content-between align-items-center">
          <h2 className="text-2xl font-semibold text-900 m-0">
            Service Layer Testing
          </h2>
          <div className="flex gap-2">
            <Link href="/config">
              <Button 
                label="Config Page" 
                icon="pi pi-cog" 
                outlined
                size="small"
              />
            </Link>
            <Link href="/state-demo">
              <Button 
                label="State Demo" 
                icon="pi pi-database" 
                outlined
                size="small"
              />
            </Link>
          </div>
        </div>
      </Card>

      {/* Service Tests */}
      <div className="grid">
        <div className="col-12 lg:col-6">
          {renderServiceTest(
            'config',
            'Config Service - Get All Config',
            'Test fetching complete configuration object',
            testConfigService
          )}
        </div>

        <div className="col-12 lg:col-6">
          {renderServiceTest(
            'configValue',
            'Config Service - Get Single Value',
            'Test fetching specific config value by key',
            testConfigValue
          )}
        </div>
      </div>

      {/* Service Architecture Info */}
      <Card className="surface-100 p-4">
        <h3 className="text-lg font-medium text-900 mb-3">Service Architecture</h3>
        <div className="text-sm text-700">
          <div className="grid">
            <div className="col-12 md:col-6">
              <h4 className="font-medium text-900 mb-2">Service Organization:</h4>
              <ul className="pl-3 mb-3">
                <li className="mb-1">• <strong>Config Service:</strong> Application configuration management</li>
                <li className="mb-1">• <strong>Instance Management:</strong> STC API client with auth</li>
                <li className="mb-1">• <strong>Type Safety:</strong> Full TypeScript interfaces</li>
                <li className="mb-1">• <strong>Utility Functions:</strong> URL building and helpers</li>
              </ul>
            </div>
            
            <div className="col-12 md:col-6">
              <h4 className="font-medium text-900 mb-2">Config Service Methods:</h4>
              <ul className="pl-3">
                <li className="mb-1">• <strong>getConfig():</strong> Fetch complete configuration</li>
                <li className="mb-1">• <strong>updateConfig():</strong> Update configuration (admin)</li>
                <li className="mb-1">• <strong>getConfigValue():</strong> Get specific config value</li>
                <li className="mb-1">• <strong>Error Handling:</strong> Fallback data on failure</li>
                <li className="mb-1">• <strong>SSR Compatible:</strong> Works server and client side</li>
              </ul>
            </div>
          </div>
          
          <Divider />
          
          <div className="grid">
            <div className="col-12">
              <h4 className="font-medium text-900 mb-2">API Configuration:</h4>
              <ul className="pl-3">
                <li className="mb-1">• <strong>STC Instance:</strong> Main API client with auth interceptors</li>
                <li className="mb-1">• <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}</li>
                <li className="mb-1">• <strong>Timeout:</strong> 10 seconds</li>
                <li className="mb-1">• <strong>Auth:</strong> Automatic Bearer token from localStorage</li>
                <li className="mb-1">• <strong>Fallback:</strong> Graceful degradation with mock data</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}