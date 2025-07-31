export default function SimplePage() {
  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{ fontSize: "2rem", marginBottom: "1rem", color: "#212529" }}
        >
          STC Frontend Next.js Demo
        </h1>
        <p
          style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#6c757d" }}
        >
          This is a simplified version to test basic functionality.
        </p>

        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#212529",
            }}
          >
            Basic Features Working
          </h2>
          <ul style={{ color: "#495057" }}>
            <li>✅ Next.js 15 with App Router</li>
            <li>✅ TypeScript compilation</li>
            <li>✅ Server-side rendering</li>
            <li>✅ Build process</li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#212529",
            }}
          >
            Test Navigation
          </h3>
          <p style={{ marginBottom: "1rem", color: "#495057" }}>
            Try visiting these pages:
          </p>
          <ul style={{ color: "#495057" }}>
            {/* <li><a href="/" style={{ color: '#007bff' }}>Home Page</a> (with PrimeReact components)</li> */}
            <li>
              <a href="/test" style={{ color: "#007bff" }}>
                Test Page
              </a>{" "}
              (simple PrimeReact test)
            </li>
            <li>
              <a href="/config" style={{ color: "#007bff" }}>
                Config Page
              </a>{" "}
              (API integration)
            </li>
            <li>
              <a href="/instructions" style={{ color: "#007bff" }}>
                Instructions
              </a>{" "}
              (setup guide)
            </li>
            <li>
              <a href="/services-demo" style={{ color: "#007bff" }}>
                Services Demo
              </a>{" "}
              (service layer testing)
            </li>
            <li>
              <a href="/login" style={{ color: "#007bff" }}>
                Login Page
              </a>{" "}
              (authentication demo)
            </li>
          </ul>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#d4edda",
            borderRadius: "4px",
            border: "1px solid #c3e6cb",
          }}
        >
          <p style={{ margin: 0, color: "#155724" }}>
            <strong>Status:</strong> If you can see this page, the basic Next.js
            setup is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
