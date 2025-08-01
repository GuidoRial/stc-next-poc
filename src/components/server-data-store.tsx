// Server-side data using Jotai's official SSR utilities
// Following the official Jotai SSR guide: https://jotai.org/docs/utilities/ssr

import { Config } from "@/services";
import { atom } from "jotai";

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

// These functions prepare data for SSR hydration
// They return the data that will be passed to useHydrateAtoms
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

// For server components that need direct access during SSR,
// we can use a simple module-level store since Server Components
// run synchronously during the render phase
let serverSSRData: SSRData = {
  config: null,
  timestamp: "",
  source: "",
};

export function setServerSSRData(data: Partial<SSRData>): void {
  serverSSRData = { ...serverSSRData, ...data };
  console.log("[Server SSR Data] Updated:", {
    hasConfig: !!serverSSRData.config,
    timestamp: serverSSRData.timestamp,
    source: serverSSRData.source,
  });
}

export function getServerSSRData(): SSRData {
  return { ...serverSSRData };
}

export function resetServerSSRData(): void {
  serverSSRData = {
    config: null,
    timestamp: "",
    source: "",
  };
  console.log("[Server SSR Data] Reset for new request");
}
