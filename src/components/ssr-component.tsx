import { getConfigDataForComponent } from "./server-data-store";

export default async function SSRComponent() {
  console.log("[SSR Component] Getting cached server-side data...");

  const cachedData = await getConfigDataForComponent("SSR Component");
  const serverData = cachedData.config;
  const fetchTimestamp = cachedData.timestamp;
  console.log("[SSR Component, dea brother] ✅ Retrieved cached server data:", {
    timestamp: fetchTimestamp,
    source: cachedData.source,
    appName: serverData?.appName,
    version: serverData?.version,
    environment: serverData?.environment,
    dataKeys: Object.keys(serverData || {}),
    wasFromCache: true, // This data comes from React's cache
  });

  console.log(
    "[SSR Component] 📦 Using cached data - no additional API calls needed!"
  );

  return <div className="p-4">Deaaaa brother</div>;
}
