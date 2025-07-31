import StateDemoClient from '@/components/state-demo-client';

export default function StateDemoPage() {
  return (
    <div className="min-h-screen surface-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-4">
            Jotai Global State Demo
          </h1>
          <p className="text-xl text-600 mb-4">
            Testing global state persistence and client-side navigation
          </p>
        </div>
        
        <StateDemoClient />
      </div>
    </div>
  );
}