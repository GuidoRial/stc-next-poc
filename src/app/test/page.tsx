import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function TestPage() {
  return (
    <div className="min-h-screen surface-50 p-4">
      <div className="max-w-30rem mx-auto">
        <Card className="p-4">
          <h1 className="text-2xl font-bold text-900 mb-4">
            Test Page
          </h1>
          <p className="text-600 mb-4">
            This is a simple test page to check if PrimeReact components are working.
          </p>
          <Button 
            label="Test Button" 
            icon="pi pi-check" 
            className="p-button-success"
          />
        </Card>
      </div>
    </div>
  );
}