"use client";

import { Config } from "@/services";
import { configAtom, updateConfigAtom } from "@/store/config";
import { useAtom } from "jotai";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Message } from "primereact/message";

interface ConfigDisplayProps {
  initialConfig: Config;
}

export default function ConfigDisplay({ initialConfig }: ConfigDisplayProps) {
  const [, updateConfig] = useAtom(updateConfigAtom);
  const [config] = useAtom(configAtom);

  // Client-side config refresh using service layer
  const refreshConfig = async () => {
    updateConfig({ isLoading: true, error: null });

    try {
      const { configService } = await import("@/services");
      const response = await configService.getConfig();

      updateConfig({
        config: response.result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to refresh config:", error);
      updateConfig({
        isLoading: false,
        error: "Failed to refresh config",
      });
    }
  };

  // Use current config data from store or fallback to initial data
  const currentConfig = config.config || initialConfig;

  return (
    <Card className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-semibold text-900 m-0">
          Interactive Configuration Display
        </h2>
        <Button
          label={config.isLoading ? "Refreshing..." : "Refresh Config"}
          icon="pi pi-refresh"
          onClick={refreshConfig}
          disabled={config.isLoading}
          loading={config.isLoading}
        />
      </div>

      {config.error && (
        <Message severity="error" text={config.error} className="mb-4" />
      )}

      {currentConfig && (
        <div className="flex flex-column gap-4">
          {/* API Connection Status */}
          {currentConfig.error && (
            <Message
              severity="error"
              className="mb-4"
              content={
                <div>
                  <div className="font-semibold mb-2">
                    API Connection Failed
                  </div>
                  <div className="text-sm mb-2">{currentConfig.error}</div>
                  <div className="text-xs">
                    <strong>Details:</strong> {currentConfig.errorDetails}
                  </div>
                  <div className="text-xs">
                    <strong>Attempted URL:</strong>{" "}
                    {currentConfig.expectedEndpoint}
                  </div>
                  <div className="text-xs">
                    <strong>Time:</strong>{" "}
                    {currentConfig.lastAttempt &&
                      new Date(currentConfig.lastAttempt).toLocaleString()}
                  </div>
                </div>
              }
            />
          )}

          {/* Success indicator for real API data */}
          {!currentConfig.fallbackData && !currentConfig.error && (
            <Message
              severity="success"
              text={`Successfully connected to STC API at ${
                currentConfig.expectedEndpoint || "localhost:4000/configs"
              }`}
              className="mb-4"
            />
          )}

          {/* App Info */}
          <div>
            <h3 className="text-lg font-medium text-900 mb-3">
              Application Info
            </h3>
            <div className="grid">
              <div className="col-12 md:col-6">
                <Card className="surface-100 p-3 h-full">
                  <label className="block text-sm font-medium text-700 mb-2">
                    App Name
                  </label>
                  <p className="text-lg text-900 m-0">
                    {currentConfig.appName || "STC API"}
                  </p>
                </Card>
              </div>
              <div className="col-12 md:col-6">
                <Card className="surface-100 p-3 h-full">
                  <label className="block text-sm font-medium text-700 mb-2">
                    Version
                  </label>
                  <p className="text-lg text-900 m-0">
                    {currentConfig.version || "Unknown"}
                  </p>
                </Card>
              </div>
              <div className="col-12 md:col-6">
                <Card className="surface-100 p-3 h-full">
                  <label className="block text-sm font-medium text-700 mb-2">
                    Environment
                  </label>
                  <Chip
                    label={currentConfig.environment || "development"}
                    className={`${
                      currentConfig.environment === "production"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  />
                </Card>
              </div>
              {currentConfig.apiStatus && (
                <div className="col-12 md:col-6">
                  <Card className="surface-100 p-3 h-full">
                    <label className="block text-sm font-medium text-700 mb-2">
                      API Status
                    </label>
                    <Chip
                      label={currentConfig.apiStatus}
                      className={`${
                        currentConfig.apiStatus === "connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    />
                  </Card>
                </div>
              )}
              {currentConfig.lastRefresh && (
                <div className="col-12 md:col-6">
                  <Card className="surface-100 p-3 h-full">
                    <label className="block text-sm font-medium text-700 mb-2">
                      Last Refresh
                    </label>
                    <p className="text-sm text-600 m-0">
                      {new Date(currentConfig.lastRefresh).toLocaleString()}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          {currentConfig.features && (
            <div>
              <h3 className="text-lg font-medium text-900 mb-3">Features</h3>
              <div className="grid">
                {Object.entries(currentConfig.features).map(
                  ([feature, enabled]) => (
                    <div key={feature} className="col-12 md:col-4">
                      <Card className="surface-100 p-3 h-full">
                        <div className="flex justify-content-between align-items-center">
                          <span className="text-sm font-medium text-700 capitalize">
                            {feature.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <Chip
                            label={enabled ? "Enabled" : "Disabled"}
                            className={`${
                              enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          />
                        </div>
                      </Card>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {currentConfig.settings && (
            <div>
              <h3 className="text-lg font-medium text-900 mb-3">Settings</h3>
              <div className="grid">
                {Object.entries(currentConfig.settings).map(
                  ([setting, value]) => (
                    <div key={setting} className="col-12 md:col-6">
                      <Card className="surface-100 p-3 h-full">
                        <label className="block text-sm font-medium text-700 mb-2 capitalize">
                          {setting.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <p className="text-lg text-900 m-0">{String(value)}</p>
                      </Card>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Raw API Response for debugging */}
          <div>
            <h3 className="text-lg font-medium text-900 mb-3">
              Raw API Response
            </h3>
            <Card className="surface-100 p-4">
              <pre className="text-sm text-700 overflow-auto white-space-pre-wrap m-0">
                {JSON.stringify(currentConfig, null, 2)}
              </pre>
            </Card>
          </div>
        </div>
      )}

      {/* State Management Demo */}
      <Message
        severity="info"
        className="mt-4"
        content={
          <div>
            <h4 className="font-medium text-blue-900 mb-2 m-0">
              Jotai State Demo
            </h4>
            <p className="text-sm text-blue-700 mb-3 m-0">
              This component demonstrates server-side rendering with client-side
              state management using Jotai. The initial data is fetched on the
              server and hydrated into the client store.
            </p>
            <div className="flex justify-content-center gap-2">
              <Link href="/state-demo">
                <Button
                  label="Test Global State"
                  icon="pi pi-database"
                  iconPos="right"
                  size="small"
                  outlined
                />
              </Link>
              <Link href="/services-demo">
                <Button
                  label="Test Services Layer"
                  icon="pi pi-cog"
                  iconPos="right"
                  size="small"
                  outlined
                />
              </Link>
            </div>
          </div>
        }
      />
    </Card>
  );
}
