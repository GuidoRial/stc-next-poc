import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import ChildComponent from './child-component';

/**
 * Parent component - doesn't receive config as props
 * Demonstrates server-side data passing without prop drilling
 */
export default function ParentComponent() {
  console.log('[ParentComponent] Rendered without receiving config props');
  
  return (
    <Card className="p-4 mt-4">
      <div className="flex align-items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold text-900 m-0">
          Parent Component
        </h3>
        <Chip 
          label="No Props Needed" 
          icon="pi pi-check" 
          className="bg-purple-100 text-purple-800"
        />
      </div>
      
      <p className="text-600 mb-3">
        This parent component doesn&apos;t receive config as props, yet its children 
        can access the config data through the server-side data store.
      </p>
      
      {/* Child component also doesn't need props */}
      <ChildComponent />
    </Card>
  );
}