import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import GrandChildComponent from './grandchild-component';

/**
 * Child component - also doesn't receive config as props
 * Passes no props to its child
 */
export default function ChildComponent() {
  console.log('[ChildComponent] Rendered without receiving config props');
  
  return (
    <Card className="surface-100 p-3 mt-3">
      <div className="flex align-items-center gap-2 mb-3">
        <h4 className="text-md font-semibold text-900 m-0">
          Child Component
        </h4>
        <Chip 
          label="Also No Props" 
          icon="pi pi-arrow-down" 
          className="bg-blue-100 text-blue-800"
        />
      </div>
      
      <p className="text-600 mb-3 text-sm">
        This child component is in the middle of the hierarchy and doesn&apos;t 
        need to know about or pass through config data.
      </p>
      
      {/* GrandChild component will access data directly from server store */}
      <GrandChildComponent />
    </Card>
  );
}