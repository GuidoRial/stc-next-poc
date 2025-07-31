import ServicesDemoClient from '@/components/services-demo-client';

export default function ServicesDemoPage() {
  return (
    <div className="min-h-screen surface-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-4">
            Services Layer Demo
          </h1>
          <p className="text-xl text-600 mb-4">
            Testing the new entity-based service architecture
          </p>
        </div>
        
        <ServicesDemoClient />
      </div>
    </div>
  );
}