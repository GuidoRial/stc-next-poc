import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import GreatGrandChildComponent from './great-grandchild-component';

/**
 * GrandChild component - still doesn't receive config as props
 * Demonstrates deep nesting without prop drilling
 */
export default function GrandChildComponent() {
  console.log('[GrandChildComponent] Rendered without receiving config props');
  
  return (
    <Card className="surface-200 p-3 mt-3">
      <div className="flex align-items-center gap-2 mb-3">
        <h5 className="text-sm font-semibold text-900 m-0">
          GrandChild Component
        </h5>
        <Chip 
          label="Still No Props" 
          icon="pi pi-arrow-down" 
          className="bg-orange-100 text-orange-800"
        />
      </div>
      
      <p className="text-600 mb-3 text-xs">
        Even at this level, we don&apos;t need to receive or pass props.
        The great-grandchild will access data directly from the server store.
      </p>
      
      {/* Great-grandchild will finally access the config data */}
      <GreatGrandChildComponent />
    </Card>
  );
}