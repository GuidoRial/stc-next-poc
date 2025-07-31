import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen surface-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6">
          <h1 className="text-3xl font-bold text-900 mb-4">
            Testing with the STC Backend
          </h1>
          
          <div className="flex flex-column gap-4">
            <p className="text-lg text-600">
              To see the real API connection in action, you need to start the STC backend API. 
              The Next.js app will attempt to connect to <code className="surface-200 p-2 border-round">localhost:4000/configs</code>.
            </p>

            <h2 className="text-2xl font-semibold text-900 mt-4 mb-3">
              Starting the STC Backend
            </h2>

            <Card className="surface-50 p-4">
              <h3 className="text-lg font-medium text-900 mb-3">Option 1: Using Docker (Recommended)</h3>
              <p className="text-sm text-700 mb-3">Navigate to the stc-main-api directory and run:</p>
              <Card className="surface-900 p-3 mb-3">
                <pre className="text-green-400 text-sm m-0">
cd ../stc-main-api{'\n'}npm run start:dev
                </pre>
              </Card>
              <p className="text-xs text-600">
                This starts PostgreSQL, Redis, and the API server on port 4000
              </p>
            </Card>

            <Card className="surface-50 p-4">
              <h3 className="text-lg font-medium text-900 mb-3">Option 2: Manual Setup</h3>
              <p className="text-sm text-700 mb-3">If Docker isn&apos;t working, you can run the API directly:</p>
              <Card className="surface-900 p-3 mb-3">
                <pre className="text-green-400 text-sm m-0">
cd ../stc-main-api{'\n'}npm install{'\n'}npm run dev
                </pre>
              </Card>
              <p className="text-xs text-600">
                Note: You&apos;ll need PostgreSQL and Redis running separately
              </p>
            </Card>

            <h2 className="text-2xl font-semibold text-900 mt-4 mb-3">
              What You&apos;ll See
            </h2>

            <div className="grid">
              <div className="col-12 md:col-6">
                <Message 
                  severity="success" 
                  className="h-full"
                  content={
                    <div>
                      <h3 className="font-medium text-green-800 mb-2 m-0">✅ API Connected</h3>
                      <p className="text-sm text-green-700 m-0">
                        When the backend is running, you&apos;ll see real configuration data from the 
                        <code>/configs</code> endpoint with a green success indicator.
                      </p>
                    </div>
                  }
                />
              </div>
              <div className="col-12 md:col-6">
                <Message 
                  severity="error" 
                  className="h-full"
                  content={
                    <div>
                      <h3 className="font-medium text-red-800 mb-2 m-0">❌ API Disconnected</h3>
                      <p className="text-sm text-red-700 m-0">
                        When the backend is not running, you&apos;ll see fallback data with detailed 
                        error information including the attempted URL and connection details.
                      </p>
                    </div>
                  }
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-900 mt-4 mb-3">
              API Endpoint Details
            </h2>

            <Message 
              severity="info" 
              content={
                <div>
                  <h3 className="font-medium text-blue-800 mb-2 m-0">Configuration Endpoint</h3>
                  <div className="text-sm text-blue-700 flex flex-column gap-1">
                    <div><strong>URL:</strong> <code>http://localhost:4000/configs</code></div>
                    <div><strong>Method:</strong> GET</div>
                    <div><strong>HTTP Client:</strong> Axios</div>
                    <div><strong>Controller:</strong> <code>server/api/controllers/config.ts</code></div>
                    <div><strong>Service:</strong> <code>server/services/config.ts</code></div>
                    <div><strong>Route:</strong> <code>server/api/routes/config.ts</code></div>
                  </div>
                </div>
              }
            />

            <h2 className="text-2xl font-semibold text-900 mt-4 mb-3">
              Testing the Connection
            </h2>

            <div className="flex flex-column gap-3 text-700">
              <div className="flex align-items-start gap-2">
                <span className="bg-primary text-primary-contrast border-circle w-2rem h-2rem flex align-items-center justify-content-center text-sm font-bold">1</span>
                <span>Start the STC backend using one of the methods above</span>
              </div>
              <div className="flex align-items-start gap-2">
                <span className="bg-primary text-primary-contrast border-circle w-2rem h-2rem flex align-items-center justify-content-center text-sm font-bold">2</span>
                <span>Wait for the message &quot;API will be running at http://localhost:4000&quot;</span>
              </div>
              <div className="flex align-items-start gap-2">
                <span className="bg-primary text-primary-contrast border-circle w-2rem h-2rem flex align-items-center justify-content-center text-sm font-bold">3</span>
                <span>Visit the /config page to see the live connection</span>
              </div>
              <div className="flex align-items-start gap-2">
                <span className="bg-primary text-primary-contrast border-circle w-2rem h-2rem flex align-items-center justify-content-center text-sm font-bold">4</span>
                <span>You should see a green success indicator and real API data</span>
              </div>
              <div className="flex align-items-start gap-2">
                <span className="bg-primary text-primary-contrast border-circle w-2rem h-2rem flex align-items-center justify-content-center text-sm font-bold">5</span>
                <span>Check the browser console for detailed request logs</span>
              </div>
            </div>

            <Message 
              severity="warn" 
              className="mt-4"
              content={
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2 m-0">💡 Development Tip</h3>
                  <p className="text-sm text-yellow-700 m-0">
                    The Next.js app includes detailed logging for API requests. Check both the 
                    browser console and the Next.js terminal output to see connection attempts 
                    and responses.
                  </p>
                </div>
              }
            />

            <div className="flex justify-content-center mt-4">
              <Link href="/config">
                <Button 
                  label="Test Configuration API" 
                  icon="pi pi-external-link" 
                  iconPos="right"
                  size="large"
                />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}