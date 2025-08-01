'use client';

import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { useConfig, useRefreshData } from '@/hooks/useSSRData';
import { Message } from 'primereact/message';
import { useAtom } from 'jotai';
import { ssrConfigAtom, ssrTimestampAtom, ssrSourceAtom } from '@/components/server-data-store';

/**
 * Client component that shows Jotai client store data
 * This demonstrates that both server and client Jotai stores have the same data
 */
export default function JotaiSyncDemo() {
  const { config, isLoading, error } = useConfig();
  const { refreshConfig } = useRefreshData();
  
  // Access SSR atoms that were hydrated using official Jotai SSR pattern
  const [ssrConfig] = useAtom(ssrConfigAtom);
  const [ssrTimestamp] = useAtom(ssrTimestampAtom);
  const [ssrSource] = useAtom(ssrSourceAtom);
  
  console.log('[JotaiSyncDemo Client] Current client Jotai store config:', config);
  console.log('[JotaiSyncDemo Client] Current SSR atoms hydrated data:', {
    ssrConfig,
    ssrTimestamp,
    ssrSource
  });
  
  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <div className="flex align-items-center gap-2">
          <h3 className="text-lg font-semibold text-900 m-0">
            Client Jotai Store Demo
          </h3>
          <Chip 
            label="Client Component" 
            icon="pi pi-desktop" 
            className="bg-cyan-100 text-cyan-800"
          />
        </div>
        <Button
          label={isLoading ? "Refreshing..." : "Refresh"}
          icon="pi pi-refresh"
          onClick={refreshConfig}
          disabled={isLoading}
          loading={isLoading}
          size="small"
        />
      </div>
      
      <div className="mb-4">
        <Chip
          label="Data from Client Jotai Store"
          icon="pi pi-database"
          className="bg-green-100 text-green-800"
        />
      </div>

      {error && <Message severity="error" text={error} className="mb-4" />}

      {config ? (
        <div className="surface-100 border-round p-3">
          <h4 className="text-lg font-medium text-900 mb-2">
            Client Store Config Data
          </h4>
          <div className="grid">
            <div className="col-12 md:col-6">
              <strong>Job Board Page Size:</strong> {String(config.job_board_page_size || 'N/A')}
            </div>
            <div className="col-12 md:col-6">
              <strong>Job Board Radius:</strong> {String(config.job_board_recommendation_radius || 'N/A')}
            </div>
            <div className="col-12 md:col-6">
              <strong>Job Post Amount:</strong> {
                typeof config.job_post_amount_cents === 'number' 
                  ? `$${(config.job_post_amount_cents / 100).toFixed(2)}`
                  : 'N/A'
              }
            </div>
            <div className="col-12 md:col-6">
              <strong>Tax Rate:</strong> {
                typeof config.job_post_tax_rate_pct === 'number'
                  ? `${config.job_post_tax_rate_pct}%`
                  : 'N/A'
              }
            </div>
          </div>
          <div className="mt-3 text-xs text-500">
            <strong>Total Keys:</strong> {Object.keys(config).length} configuration items
          </div>
        </div>
      ) : (
        <div className="surface-100 border-round p-3 text-center">
          <span className="text-600">No configuration data available in client store</span>
        </div>
      )}

      <Message
        severity="success"
        className="mt-4"
        content={
          <div>
            <p className="text-sm m-0">
              <strong>✅ Synchronized!</strong> This client component accesses the same config data 
              that was stored in the server-side Jotai store and automatically hydrated to the client store.
            </p>
          </div>
        }
      />

      {/* Show SSR atoms data */}
      <Card className="surface-100 mt-4 p-3">
        <div className="flex align-items-center gap-2 mb-3">
          <h4 className="text-md font-semibold text-900 m-0">
            Official Jotai SSR Atoms Data
          </h4>
          <Chip 
            label="SSR Hydrated" 
            icon="pi pi-sync" 
            className="bg-purple-100 text-purple-800"
          />
        </div>
        
        {ssrConfig ? (
          <div>
            <div className="mb-2 text-sm">
              <strong>Source:</strong> {ssrSource}
            </div>
            <div className="mb-2 text-sm">
              <strong>Timestamp:</strong> {ssrTimestamp ? new Date(ssrTimestamp).toLocaleString() : 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Config Keys:</strong> {Object.keys(ssrConfig).length} items
            </div>
            <div className="mt-2 text-xs text-600">
              This data was hydrated from server-side SSR atoms using Jotai&apos;s official SSR utilities
            </div>
          </div>
        ) : (
          <div className="text-sm text-600">
            No SSR atom data available
          </div>
        )}
      </Card>
    </Card>
  );
}