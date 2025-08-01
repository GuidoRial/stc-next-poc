import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { getConfigDataForComponent } from "../server-data-store";

/**
 * Great-GrandChild component - Finally accesses the config data!
 * This demonstrates accessing server-side data 4 levels deep without prop drilling
 * Now using React's cache function for server-side data access
 */
export default async function GreatGrandChildComponent() {
  // Access cached data - this will reuse the same data fetched in layout/other components
  const cachedData = await getConfigDataForComponent(
    "GreatGrandChild Component"
  );
  const { config, timestamp, source } = cachedData;

  console.log("[GreatGrandChildComponent] Accessing config from React cache:", {
    configExists: !!config,
    timestamp,
    source,
    configKeys: config ? Object.keys(config).length : 0,
    usedCache: true,
  });

  return (
    <Card className="surface-300 p-3 mt-3">
      <div className="flex align-items-center gap-2 mb-3">
        <h6 className="text-xs font-semibold text-900 m-0">
          Great-GrandChild Component
        </h6>
        <Chip
          label="Has Config Data!"
          icon="pi pi-database"
          className="bg-green-100 text-green-800"
        />
      </div>

      <div className="text-xs">
        <div className="mb-2">
          <strong>Data Source:</strong> {source}
        </div>
        <div className="mb-2">
          <strong>Fetched At:</strong>{" "}
          {new Date(timestamp).toLocaleTimeString()}
        </div>

        {config ? (
          <div className="surface-400 border-round p-2 mt-2">
            <div className="font-semibold mb-1">Config Sample:</div>
            <div>Page Size: {String(config.job_board_page_size || "N/A")}</div>
            <div>
              Radius: {String(config.job_board_recommendation_radius || "N/A")}
            </div>
            <div className="mt-1 text-xs">
              Total keys: {Object.keys(config).length}
            </div>
          </div>
        ) : (
          <div className="surface-400 border-round p-2 mt-2 text-center">
            <span className="text-red-600">No config data available</span>
          </div>
        )}
      </div>

      <div className="mt-3 p-2 bg-green-50 border-round">
        <div className="text-xs text-green-800">
          <strong>✅ Success!</strong> This component is 4 levels deep from the
          page component but accessed the config data using React&apos;s cache
          function without any prop drilling:
          <br />
          Page → Parent → Child → GrandChild → <strong>GreatGrandChild</strong>
          <br />
          <em>Data reused from cache - no additional API calls!</em>
        </div>
      </div>
    </Card>
  );
}
