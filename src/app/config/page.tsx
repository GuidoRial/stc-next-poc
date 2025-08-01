import AuthStatus from "@/components/auth-status";
import ConfigDisplay from "@/components/config-display";
import { Chip } from "primereact/chip";
import { Config } from "@/services";

// This Server Component no longer needs to fetch data - it's already in the store!
export default function ConfigPage() {
  return (
    <div className="min-h-screen surface-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-4">
            STC API Configuration
          </h1>
          <p className="text-xl text-600 mb-4">
            Data fetched once in root layout and hydrated to Jotai store
          </p>
          <div className="flex justify-content-center gap-2 flex-wrap">
            <Chip
              label="Server-Side Rendered"
              icon="pi pi-check"
              className="bg-green-100 text-green-800"
            />
            <Chip
              label="Store Hydrated"
              icon="pi pi-database"
              className="bg-blue-100 text-blue-800"
            />
            <Chip
              label="No Extra Requests"
              icon="pi pi-bolt"
              className="bg-purple-100 text-purple-800"
            />
          </div>
        </div>

        {/* Authentication Status */}
        <AuthStatus />

        {/* Client component gets data from hydrated store */}
        <ConfigDisplay initialConfig={{} as Config} />
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
