import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Message } from "primereact/message";
import { Config } from "@/services";

interface SSRDemoProps {
  config: Config | null;
  timestamp: string;
  source: string;
}

/**
 * Server component that receives config data as props
 */
export default function SSRDemo({ config, timestamp, source }: SSRDemoProps) {
  console.log(`[SSRDemo Server Component] Rendered with config from ${source}:`, config);
  return (
    <Card className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h3 className="text-xl font-semibold text-900 m-0">
          Server Component Data Demo
        </h3>
        <div className="flex align-items-center gap-2">
          <Chip
            label={`From ${source}`}
            icon="pi pi-server"
            className="bg-blue-100 text-blue-800"
          />
          <span className="text-xs text-600">{timestamp}</span>
        </div>
      </div>

      <div className="mb-4">
        <Chip
          label="Server-Side Rendered"
          icon="pi pi-check"
          className="bg-green-100 text-green-800"
        />
      </div>

      {config ? (
        <div className="surface-100 border-round p-3">
          <h4 className="text-lg font-medium text-900 mb-2">
            Configuration Data
          </h4>
          <div className="grid">
            <div className="col-12 md:col-6">
              <strong>Job Board Page Size:</strong> {String(config.job_board_page_size || 'N/A')}
            </div>
            <div className="col-12 md:col-6">
              <strong>Job Board Radius:</strong> {String(config.job_board_recommendation_radius || 'N/A')}
            </div>
            <div className="col-12 md:col-6">
              <strong>Job Post Amount:</strong> {
                typeof config.job_post_amount_cents === 'number' 
                  ? `$${(config.job_post_amount_cents / 100).toFixed(2)}`
                  : 'N/A'
              }
            </div>
            <div className="col-12 md:col-6">
              <strong>Tax Rate:</strong> {
                typeof config.job_post_tax_rate_pct === 'number'
                  ? `${config.job_post_tax_rate_pct}%`
                  : 'N/A'
              }
            </div>
          </div>
          <div className="mt-3 text-xs text-500">
            <strong>Total Keys:</strong> {Object.keys(config).length} configuration items
          </div>
        </div>
      ) : (
        <div className="surface-100 border-round p-3 text-center">
          <span className="text-600">No configuration data available</span>
        </div>
      )}

      <Message
        severity="info"
        className="mt-4"
        content={
          <div>
            <p className="text-sm m-0">
              <strong>How it works:</strong> Data is fetched in the parent server component 
              and passed as props to this child server component. No client-side JavaScript needed!
            </p>
          </div>
        }
      />
    </Card>
  );
}
