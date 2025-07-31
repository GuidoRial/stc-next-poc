import { Config, configService } from "@/services";

// Server-side API utilities for SSR
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApiResponse<T> {
  result: T;
}

export async function fetchConfig(): Promise<ApiResponse<Config>> {
  const fullUrl = `${API_BASE_URL}/configs`;

  console.log(`[Config Service] Attempting to fetch from: ${fullUrl}`);

  try {
    const response = await configService.getConfig();

    console.log(`[Config Service] Successfully fetched config data:`, response);

    // Ensure the response has the expected structure
    // if (!response.result.data || typeof response.result.data !== "object") {
    //   throw new Error("Invalid response format from API");
    // }

    return { result: response.result };
  } catch (error) {
    // Only log errors in development to avoid cluttering production builds
    if (process.env.NODE_ENV === "development") {
      console.error("[Config Service] Failed to fetch config:", error);
    }

    let errorMessage = "Unknown error";
    let statusCode = "Unknown";

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; statusText: string; data: unknown };
        request?: unknown;
        message?: string;
      };
      if (axiosError.response) {
        statusCode = axiosError.response.status.toString();
        errorMessage = `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`;
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[Config Service] Response error:",
            axiosError.response.data
          );
        }
      } else if (axiosError.request) {
        errorMessage = "No response received from server - API may be offline";
        if (process.env.NODE_ENV === "development") {
          console.error("[Config Service] Request error:", axiosError.request);
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
        if (process.env.NODE_ENV === "development") {
          console.error("[Config Service] Setup error:", axiosError.message);
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      if (process.env.NODE_ENV === "development") {
        console.error("[Config Service] Generic error:", error);
      }
    }

    // Always return a valid response structure with fallback data
    const fallbackResponse: ApiResponse<Config> = {
      result: {
        error: `Failed to connect to STC API at ${fullUrl}`,
        errorDetails: errorMessage,
        statusCode,
        fallbackData: true,
        appName: "Skilled Trades Connect (Fallback)",
        version: "1.0.0-fallback",
        environment: "development",
        apiStatus: "disconnected",
        lastAttempt: new Date().toISOString(),
        expectedEndpoint: fullUrl,
        features: {
          jobBoard: true,
          userProfiles: true,
          messaging: true,
        },
        settings: {
          itemsPerPage: 10,
          maxFileSize: "5MB",
        },
      },
    };

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[Config Service] Returning fallback data:",
        fallbackResponse
      );
    }
    return fallbackResponse;
  }
}
