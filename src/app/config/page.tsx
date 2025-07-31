import AuthStatus from "@/components/auth-status";
import ConfigDisplay from "@/components/config-display";
import { fetchConfig } from "@/lib/api";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";

// This is a Server Component that uses SSR
export default async function ConfigPage() {
  // Fetch config data on the server
  const configResponse = await fetchConfig();

  return (
    <div className="min-h-screen surface-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-4">
            STC API Configuration
          </h1>
          <p className="text-xl text-600 mb-4">
            Live data from{" "}
            <code className="surface-200 p-2 border-round text-sm">
              localhost:4000/configs
            </code>
          </p>
          <div className="flex justify-content-center gap-2 flex-wrap">
            <Chip
              label="Server-Side Rendered"
              icon="pi pi-check"
              className="bg-green-100 text-green-800"
            />
            <Chip
              label="Real API Connection"
              icon="pi pi-link"
              className="bg-blue-100 text-blue-800"
            />
          </div>
        </div>

        {/* Authentication Status */}
        <AuthStatus />

        {/* Pass server data to client component for interactivity */}
        <ConfigDisplay initialConfig={configResponse.result} />

        {/* Server-rendered static content */}
        <Card className="mt-4">
          <h2 className="text-2xl font-semibold text-900 mb-3">
            Server-Side Data Preview
          </h2>
          <div className="surface-100 border-round p-4">
            <pre className="text-sm text-700 overflow-auto white-space-pre-wrap m-0">
              {JSON.stringify(configResponse.result, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Generate metadata for SEO (this runs on the server)
export async function generateMetadata() {
  return {
    title: `${"STC"} - Configuration`,
    description: `Global configuration for STC API`,
    openGraph: {
      title: "STC Configuration",
      description: "Live configuration data from STC API",
    },
  };
}
