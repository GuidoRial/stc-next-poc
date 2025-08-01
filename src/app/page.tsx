import Link from "next/link";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Home() {
  return (
    <div className="min-h-screen surface-50">
      <div className="flex flex-column align-items-center p-4 md:p-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-900 mb-4">
              STC Frontend Next.js Demo
            </h1>
            <p className="text-xl text-600 mb-4">
              Demonstrating Server-Side Rendering with Jotai state management
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-green-500 text-4xl mb-3">
                <i className="pi pi-rocket"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-900">Next.js 15</h3>
              <p className="text-600">Latest Next.js with App Router and Server Components</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-blue-500 text-4xl mb-3">
                <i className="pi pi-bolt"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-900">Server-Side Rendering</h3>
              <p className="text-600">Pre-rendered content for better SEO and performance</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-purple-500 text-4xl mb-3">
                <i className="pi pi-refresh"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-900">Jotai State Management</h3>
              <p className="text-600">Atomic state management for React applications</p>
            </Card>
          </div>

          {/* Demo section */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold text-900 mb-3">
              Live Demo
            </h2>
            <p className="text-600 mb-4">
              This demo fetches global configuration data from the STC API using server-side rendering,
              then hydrates it into a Jotai store for client-side state management.
            </p>
            
            <div className="flex flex-column sm:flex-row gap-3 justify-content-center">
              <Link href="/ssr-demo">
                <Button 
                  label="SSR + Jotai Demo" 
                  icon="pi pi-bolt" 
                  iconPos="right"
                  size="large"
                />
              </Link>
              <Link href="/config">
                <Button 
                  label="Configuration Demo" 
                  icon="pi pi-cog" 
                  iconPos="right"
                  outlined
                  size="large"
                />
              </Link>
              <Link href="/instructions">
                <Button 
                  label="Setup Instructions" 
                  icon="pi pi-info-circle" 
                  iconPos="right"
                  outlined
                  size="large"
                />
              </Link>
            </div>
          </Card>

          {/* Architecture info */}
          <Card className="p-6 surface-100">
            <h3 className="text-xl font-semibold text-900 mb-4">Architecture Overview</h3>
            <div className="flex flex-column gap-3">
              <div className="flex align-items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-1"></i>
                <span className="text-700">
                  <strong>Server Components:</strong> Fetch data on the server for improved SEO and initial load performance
                </span>
              </div>
              <div className="flex align-items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-1"></i>
                <span className="text-700">
                  <strong>Client Components:</strong> Handle user interactions and dynamic updates with Jotai
                </span>
              </div>
              <div className="flex align-items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-1"></i>
                <span className="text-700">
                  <strong>Hydration:</strong> Server data is seamlessly transferred to client-side state management
                </span>
              </div>
              <div className="flex align-items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-1"></i>
                <span className="text-700">
                  <strong>API Integration:</strong> Connects to STC backend API with fallback for development
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}