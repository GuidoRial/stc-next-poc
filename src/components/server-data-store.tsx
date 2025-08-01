// Server-side data using Jotai's official SSR utilities + React's cache function
// Following the official Jotai SSR guide: https://jotai.org/docs/utilities/ssr

import { fetchConfig } from "@/lib/api";
import { Config } from "@/services";
import { atom } from "jotai";
import { cache } from "react";

// Define atoms that will be used for SSR hydration
// These atoms will be hydrated on the client using useHydrateAtoms
export const ssrConfigAtom = atom<Config | null>(null);
export const ssrTimestampAtom = atom<string>("");
export const ssrSourceAtom = atom<string>("");

// Combined derived atom for convenience
export const ssrDataAtom = atom((get) => ({
  config: get(ssrConfigAtom),
  timestamp: get(ssrTimestampAtom),
  source: get(ssrSourceAtom),
}));

// Helper type for SSR data structure
export interface SSRData {
  config: Config | null;
  timestamp: string;
  source: string;
}

// Cached server-side data fetching using React's cache function
// This ensures data is fetched once per request and shared across components
// The cache function caches based on all arguments, so we use a constant key for true sharing
export const getCachedConfigData = cache(async (): Promise<SSRData> => {
  console.log(`[getCachedConfigData] Fetching config data (cache miss)...`);

  try {
    const configResponse = await fetchConfig();
    const ssrData: SSRData = {
      config: configResponse.result,
      timestamp: new Date().toISOString(),
      source: "React Cache",
    };

    console.log(`[getCachedConfigData] Successfully cached config data:`, {
      hasConfig: !!ssrData.config,
      timestamp: ssrData.timestamp,
      source: ssrData.source,
      configKeys: ssrData.config ? Object.keys(ssrData.config).length : 0,
    });

    return ssrData;
  } catch (error) {
    console.error(`[getCachedConfigData] Failed to fetch config data:`, error);
    return {
      config: null,
      timestamp: new Date().toISOString(),
      source: "React Cache (Error)",
    };
  }
});

// Wrapper function for components that need to log their source
export async function getConfigDataForComponent(
  componentName: string
): Promise<SSRData> {
  console.log(`[${componentName}] Getting cached config data...`);
  const data = await getCachedConfigData();
  console.log(`[${componentName}] Retrieved data from cache:`, {
    hasConfig: !!data.config,
    timestamp: data.timestamp,
    source: data.source,
    wasCacheHit: true,
  });
  return data;
}

// Function to prepare SSR data for client hydration
// This calls the cached function to get the same data that server components use
export async function prepareSSRDataForHydration(
  _source: string = "SSR Hydration"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Array<[any, any]>> {
  const ssrData = await getCachedConfigData();

  console.log(
    "[prepareSSRDataForHydration] Preparing SSR data for client hydration:",
    {
      hasConfig: !!ssrData.config,
      timestamp: ssrData.timestamp,
      source: ssrData.source,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydrateAtoms: Array<[any, any]> = [];

  if (ssrData.config !== undefined) {
    hydrateAtoms.push([ssrConfigAtom, ssrData.config]);
  }
  if (ssrData.timestamp !== undefined) {
    hydrateAtoms.push([ssrTimestampAtom, ssrData.timestamp]);
  }
  if (ssrData.source !== undefined) {
    hydrateAtoms.push([ssrSourceAtom, ssrData.source]);
  }

  return hydrateAtoms;
}

// Synchronous version for immediate hydration (when data is already available)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prepareSSRData(data: Partial<SSRData>): Array<[any, any]> {
  console.log("[prepareSSRData] Preparing SSR data for hydration:", data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydrateAtoms: Array<[any, any]> = [];

  if (data.config !== undefined) {
    hydrateAtoms.push([ssrConfigAtom, data.config]);
  }
  if (data.timestamp !== undefined) {
    hydrateAtoms.push([ssrTimestampAtom, data.timestamp]);
  }
  if (data.source !== undefined) {
    hydrateAtoms.push([ssrSourceAtom, data.source]);
  }

  return hydrateAtoms;
}
