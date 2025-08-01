import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { getServerSSRData } from '../server-data-store';

/**
 * Great-GrandChild component - Finally accesses the config data!
 * This demonstrates accessing server-side data 4 levels deep without prop drilling
 * Now using Jotai server store instead of custom store
 */
export default function GreatGrandChildComponent() {
  // Access data from server-side SSR data store using official Jotai SSR pattern
  const ssrData = getServerSSRData();
  const { config, timestamp, source } = ssrData;
  
  console.log('[GreatGrandChildComponent] Accessing config from official Jotai SSR store:', {
    configExists: !!config,
    timestamp,
    source,
    configKeys: config ? Object.keys(config).length : 0
  });
  
  return (
    <Card className="surface-300 p-3 mt-3">
      <div className="flex align-items-center gap-2 mb-3">
        <h6 className="text-xs font-semibold text-900 m-0">
          Great-GrandChild Component
        </h6>
        <Chip 
          label="Has Config Data!" 
          icon="pi pi-database" 
          className="bg-green-100 text-green-800"
        />
      </div>
      
      <div className="text-xs">
        <div className="mb-2">
          <strong>Data Source:</strong> {source}
        </div>
        <div className="mb-2">
          <strong>Fetched At:</strong> {new Date(timestamp).toLocaleTimeString()}
        </div>
        
        {config ? (
          <div className="surface-400 border-round p-2 mt-2">
            <div className="font-semibold mb-1">Config Sample:</div>
            <div>Page Size: {String(config.job_board_page_size || 'N/A')}</div>
            <div>Radius: {String(config.job_board_recommendation_radius || 'N/A')}</div>
            <div className="mt-1 text-xs">
              Total keys: {Object.keys(config).length}
            </div>
          </div>
        ) : (
          <div className="surface-400 border-round p-2 mt-2 text-center">
            <span className="text-red-600">No config data available</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 p-2 bg-green-50 border-round">
        <div className="text-xs text-green-800">
          <strong>✅ Success!</strong> This component is 4 levels deep from the page component 
          but accessed the config data without any prop drilling through:
          <br />
          Page → Parent → Child → GrandChild → <strong>GreatGrandChild</strong>
        </div>
      </div>
    </Card>
  );
}