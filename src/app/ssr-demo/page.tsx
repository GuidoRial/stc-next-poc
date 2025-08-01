import JotaiSyncDemo from "@/components/jotai-sync-demo";
import ParentComponent from "@/components/nested-components/parent-component";
import { getConfigDataForComponent } from "@/components/server-data-store";
import SSRDemo from "@/components/ssr-demo";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";

/**
 * Server component that fetches data directly and logs it during SSR
 */
export default async function SSRDemoPage() {
  // Use React's cache function to get server data - this will reuse the same data from layout
  console.log("[SSR-Demo Page] Getting cached server-side data...");

  const cachedData = await getConfigDataForComponent("SSR Demo Page");
  const serverData = cachedData.config;
  const fetchTimestamp = cachedData.timestamp;

  console.log("[SSR-Demo Page] ✅ Retrieved cached server data:", {
    timestamp: fetchTimestamp,
    source: cachedData.source,
    appName: serverData?.appName,
    version: serverData?.version,
    environment: serverData?.environment,
    dataKeys: Object.keys(serverData || {}),
    wasFromCache: true, // This data comes from React's cache
  });

  console.log(
    "[SSR-Demo Page] 📦 Using cached data - no additional API calls needed!"
  );

  return (
    <div className="min-h-screen surface-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-4">
            SSR + Jotai Hydration Demo
          </h1>
          <p className="text-xl text-600 mb-4">
            Data fetched directly in server component + available from hydrated
            store
          </p>
          <div className="flex justify-content-center gap-2 flex-wrap">
            <Chip
              label="Server-Side Rendered"
              icon="pi pi-server"
              className="bg-blue-100 text-blue-800"
            />
            <Chip
              label="Client-Side Hydrated"
              icon="pi pi-desktop"
              className="bg-green-100 text-green-800"
            />
            <Chip
              label="No Extra Requests"
              icon="pi pi-bolt"
              className="bg-purple-100 text-purple-800"
            />
          </div>
        </div>

        {/* Server-rendered data display */}
        <Card className="mb-4 p-4">
          <h3 className="text-xl font-semibold text-900 mb-3">
            Server Component Data (Fetched During SSR)
          </h3>
          <div className="flex align-items-center gap-2 mb-3">
            <Chip
              label="Fetched on Server"
              icon="pi pi-server"
              className="bg-blue-100 text-blue-800"
            />
            <span className="text-sm text-600">
              Timestamp: {fetchTimestamp}
            </span>
          </div>

          {serverData ? (
            <div className="surface-100 border-round p-3">
              <h4 className="text-lg font-medium text-900 mb-2">
                Server Data: {"STC API"}
              </h4>
              <p className="text-600 mb-2">
                Version: {"Unknown"} | Environment: {"development"}
              </p>
              <div className="text-xs text-500">
                <strong>Available Keys:</strong>{" "}
                {Object.keys(serverData).join(", ")}
              </div>
            </div>
          ) : (
            <div className="surface-100 border-round p-3 text-center">
              <span className="text-600">No server data available</span>
            </div>
          )}
        </Card>

        {/* Pass server data as props to child server component */}
        <SSRDemo
          config={serverData}
          timestamp={fetchTimestamp}
          source="Page Server Component"
        />

        {/* Demonstrate nested components accessing server data without prop drilling */}
        <Card className="mt-4 p-4 surface-100">
          <h2 className="text-2xl font-semibold text-900 mb-3">
            Server-Side Data Passing Demo (No Prop Drilling)
          </h2>
          <div className="mb-4">
            <p className="text-600 mb-2">
              The following component hierarchy demonstrates passing data 4
              levels deep without prop drilling using a server-side data store
              pattern:
            </p>
            <div className="flex align-items-center gap-2 text-sm">
              <Chip label="Page" className="bg-red-100 text-red-800" />
              <i className="pi pi-arrow-right text-400"></i>
              <Chip label="Parent" className="bg-purple-100 text-purple-800" />
              <i className="pi pi-arrow-right text-400"></i>
              <Chip label="Child" className="bg-blue-100 text-blue-800" />
              <i className="pi pi-arrow-right text-400"></i>
              <Chip
                label="GrandChild"
                className="bg-orange-100 text-orange-800"
              />
              <i className="pi pi-arrow-right text-400"></i>
              <Chip
                label="GreatGrandChild"
                className="bg-green-100 text-green-800"
              />
            </div>
          </div>

          {/* This parent component receives no props but its great-grandchild will access config */}
          <ParentComponent />
        </Card>

        {/* Demonstrate client-side Jotai store accessing the same data */}
        <JotaiSyncDemo />

        <Card className="mt-4 p-4 surface-100">
          <h2 className="text-2xl font-semibold text-900 mb-3">
            Unified Jotai Data Store Pattern
          </h2>
          <div className="flex flex-column gap-3">
            <div className="flex align-items-start gap-2">
              <i className="pi pi-server text-blue-500 mt-1"></i>
              <span className="text-700">
                <strong>Server Jotai Store:</strong> Uses createStore() for
                server-side data management, enables deep component access
                without prop drilling
              </span>
            </div>
            <div className="flex align-items-start gap-2">
              <i className="pi pi-desktop text-green-500 mt-1"></i>
              <span className="text-700">
                <strong>Client Jotai Store:</strong> Automatically hydrated with
                server data, enables client-side reactivity and updates
              </span>
            </div>
            <div className="flex align-items-start gap-2">
              <i className="pi pi-sync text-purple-500 mt-1"></i>
              <span className="text-700">
                <strong>Synchronized:</strong> Both server and client stores
                contain the same data, ensuring consistency across SSR and
                client rendering
              </span>
            </div>
            <div className="flex align-items-start gap-2">
              <i className="pi pi-sitemap text-orange-500 mt-1"></i>
              <span className="text-700">
                <strong>Unified Architecture:</strong> Single Jotai-based
                solution for both server and client data management
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "SSR + Jotai Demo - STC Frontend",
    description:
      "Demonstration of server-side rendering with Jotai store hydration",
  };
}
