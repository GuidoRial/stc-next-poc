# STC Frontend Next.js Demo

A Next.js 15 demonstration project showcasing Server-Side Rendering (SSR) with Jotai state management and PrimeReact components, built as a prototype for the Skilled Trades Connect frontend migration.

## Features

- **Next.js 15** with App Router and Server Components
- **Server-Side Rendering** for improved SEO and performance
- **Jotai** for atomic state management (replacing Hookstate patterns)
- **PrimeReact & PrimeFlex** for UI components and styling
- **Axios** for HTTP requests
- **TypeScript** for type safety
- **Real API Integration** with the STC backend

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   The app is pre-configured to connect to `localhost:4000/configs`. Update `.env.local` if needed:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Test the API connection:**
   - Click "View Configuration Demo" to see server-side rendered data
   - Click "Setup Instructions" for detailed backend setup guide

## Component Architecture

This project demonstrates migration from the original STC frontend patterns to Next.js:

### Original vs. New Architecture

| Component | Original STC Frontend | Next.js Demo | Migration Notes |
|-----------|----------------------|--------------|-----------------|
| **UI Components** | PrimeReact + Material-UI | PrimeReact + PrimeFlex | Removed Material-UI, using PrimeFlex for layouts |
| **State Management** | Hookstate stores | Jotai atoms | Similar reactive patterns, atomic approach |
| **HTTP Requests** | Axios services | Axios with SSR support | Server-side + client-side requests |
| **Styling** | Custom CSS + Tailwind | PrimeReact themes + PrimeFlex | Consistent PrimeReact ecosystem |
| **Routing** | React Router | Next.js App Router | File-based routing with SSR |

### PrimeReact Components Used

- **Cards** - Container components for content sections
- **Buttons** - Interactive elements with icons and loading states
- **Messages** - Status indicators (success, error, info, warning)
- **Chips** - Status badges and labels
- **Skeleton** - Loading placeholders during hydration
- **Grid System** - PrimeFlex responsive layout

### State Management Migration

**Original Hookstate Pattern:**
```typescript
// Original
const state = hookstate(initialState);
state.someProperty.set(newValue);
const value = state.someProperty.get();
```

**New Jotai Pattern:**
```typescript
// New
const configAtom = atom(initialState);
const [config, setConfig] = useAtom(configAtom);
const updateAtom = atom(null, (get, set, update) => {
  set(configAtom, { ...get(configAtom), ...update });
});
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── config/            # Configuration demo (SSR)
│   ├── instructions/      # Setup instructions
│   ├── layout.tsx         # Root layout with PrimeReact providers
│   ├── globals.css        # PrimeReact theme imports
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── providers.tsx      # Jotai Provider setup
│   └── config-display.tsx # Interactive config component
├── lib/                   # Server-side utilities
│   └── api.ts            # Axios API calls for SSR
└── store/                 # Jotai atoms
    └── config.ts         # Configuration state management
```

## API Integration

### Server-Side Rendering
```typescript
// Server Component - runs on the server
export default async function ConfigPage() {
  const configResponse = await fetchConfig(); // Axios call
  return <ConfigDisplay initialConfig={configResponse.result} />;
}
```

### Client-Side State Management
```typescript
// Client Component - hydrates server data
'use client';
export default function ConfigDisplay({ initialConfig }) {
  const [, updateConfig] = useAtom(updateConfigAtom);
  
  useEffect(() => {
    updateConfig({ config: initialConfig, isLoading: false });
  }, [initialConfig]);
}
```

### Axios Configuration
```typescript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

## Testing the Application

### With STC Backend Running
1. Start the STC backend: `cd ../stc-main-api && npm run start:dev`
2. Visit `/config` - you'll see real API data with success indicators
3. All configuration values from the STC database will be displayed

### Without STC Backend
1. Visit `/config` - you'll see detailed error information
2. Fallback data ensures the page still renders properly
3. Error details include connection attempts and debugging info

## Key Demonstrations

### 1. Server-Side Rendering
- **SEO Friendly**: Complete HTML sent to crawlers
- **Performance**: Initial page load includes rendered content
- **Real Data**: Fetches live configuration from STC API

### 2. PrimeReact Integration
- **Consistent Design**: All components use PrimeReact theme
- **Responsive**: PrimeFlex grid system for all layouts
- **Interactive**: Buttons, messages, and status indicators

### 3. State Management
- **Jotai Atoms**: Atomic state management similar to Hookstate
- **Server Hydration**: Seamless transfer from server to client state
- **Error Handling**: Comprehensive error states and fallbacks

### 4. Component Architecture
- **Server Components**: Data fetching and SEO optimization
- **Client Components**: User interactions and dynamic updates
- **Hybrid Approach**: Best of both server and client rendering

## Migration Benefits

1. **SEO Optimization**: Google can now index job postings and content
2. **Performance**: Server-rendered initial content loads faster
3. **Consistent UI**: Single component library (PrimeReact) throughout
4. **Type Safety**: Full TypeScript support with proper error handling
5. **Developer Experience**: Familiar patterns with modern Next.js features
6. **Production Ready**: Builds successfully with optimized output

## Build Output

The application successfully builds and includes:
- **Static Pages**: Home and instructions pre-rendered
- **Dynamic Pages**: Config page with server-side rendering
- **Code Splitting**: Optimized JavaScript chunks
- **Real API Data**: Connects to STC backend during build process

## Next Steps for Full Migration

This demo provides the foundation for migrating the complete STC frontend:

1. **Component Migration**: Convert existing components to PrimeReact
2. **State Management**: Replace Hookstate stores with Jotai atoms
3. **API Services**: Extend Axios patterns for all endpoints
4. **SSR Strategy**: Apply server-side rendering to job listings and company profiles
5. **Build Pipeline**: Update deployment for Next.js server requirements

The architecture successfully demonstrates solving the Google indexing problems while maintaining familiar development patterns and improving the overall user experience.