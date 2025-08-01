# Per-View Data Fetching Pattern with SSR + Jotai

## Overview

This document explains how to implement a scalable data fetching pattern where:
1. **Global data** is fetched once in the root layout (user info, app config)
2. **View-specific data** is fetched at the page level for each route
3. **All data** is automatically hydrated into Jotai stores for client-side access

This approach combines the benefits of SSR performance, proper data locality, and seamless client-side state management.

## Multi-Level Information Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your Server   │    │  Next.js Server │    │  Next.js Client │
│  (Backend API)  │    │   (SSR Layer)   │    │   (Browser)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ GLOBAL DATA LAYER     │                       │
         │ 1a. GET /auth/session │                       │
         │◄──────────────────────│                       │
         │ 1b. GET /configs      │                       │
         │◄──────────────────────│                       │
         │                       │                       │
         │ 2. Global Responses   │                       │
         │ { user, config }      │                       │
         │──────────────────────►│                       │
         │                       │                       │
         │ VIEW-SPECIFIC LAYER   │                       │
         │ 3a. GET /users/123    │                       │
         │◄──────────────────────│                       │
         │ 3b. GET /users/123/   │                       │
         │     posts             │                       │
         │◄──────────────────────│                       │
         │ 3c. GET /users/123/   │                       │
         │     followers         │                       │
         │◄──────────────────────│                       │
         │                       │                       │
         │ 4. View Responses     │                       │
         │ { profile, posts,     │                       │
         │   followers }         │                       │
         │──────────────────────►│                       │
         │                       │                       │
         │                       │ 5. Combined HTML     │
         │                       │ + Global Data         │
         │                       │ + View Data           │
         │                       │──────────────────────►│
         │                       │                       │
         │                       │                       │ 6. Multi-Store
         │                       │                       │ Hydration
         │                       │                       │ - Global Store
         │                       │                       │ - View Store
         │                       │                       │
         │ 7. Client Updates     │                       │
         │ (Refresh/Actions)     │                       │
         │◄──────────────────────────────────────────────│
```

## Data Locality Architecture

```
Application Structure:
├── Root Layout (Global Scope)
│   ├── Global Provider (auth, config, theme)
│   │   ├── User Authentication State
│   │   ├── Application Configuration
│   │   └── Feature Flags
│   │
│   └── Section Layout (Section Scope)
│       ├── Section Provider (shared resources)
│       │   ├── Navigation Data
│       │   ├── Category Lists
│       │   └── Common Settings
│       │
│       └── Page Component (Page Scope)
│           ├── Page Provider (view-specific)
│           │   ├── Page-Specific Data
│           │   ├── User Content
│           │   └── Dynamic Lists
│           │
│           └── Child Components
│               ├── Access Global Data
│               ├── Access Section Data
│               └── Access Page Data
```

## Architecture Overview

```
Root Layout (Global Data)
├── User Authentication State
├── Application Configuration  
├── Feature Flags
└── Theme Preferences

Page Level (View-Specific Data)
├── /profile → User Profile Data
├── /products → Product Catalog Data
├── /dashboard → Analytics Data
└── /settings → User Preferences Data
```

## Implementation Strategy

### 1. Root Layout: Global Data

The root layout handles application-wide data that's needed across multiple views:

```tsx
// src/app/layout.tsx
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch global data needed across the entire app
  let globalData = {};
  
  try {
    // Parallel fetching of global data
    const [configResponse, authResponse] = await Promise.allSettled([
      fetchConfig(),
      fetchUserSession(), // Check if user is authenticated
    ]);
    
    globalData = {
      config: configResponse.status === 'fulfilled' ? configResponse.value.result : null,
      auth: authResponse.status === 'fulfilled' ? authResponse.value.result : null,
    };
  } catch (error) {
    console.error("Failed to fetch global data:", error);
  }

  return (
    <html lang="en">
      <body>
        <Providers initialData={globalData}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

#### Method Breakdown:

**`Promise.allSettled([...])`**
- **Purpose**: Executes multiple async operations in parallel
- **Difference from Promise.all**: Doesn't fail if one request fails
- **Return Type**: Array of settled promise results (fulfilled or rejected)
- **Benefit**: Faster execution than sequential awaits

**`configResponse.status === 'fulfilled'`**
- **Purpose**: Checks if the individual promise succeeded
- **Status Options**: 'fulfilled' (success) or 'rejected' (failure)
- **Safety**: Prevents accessing .value on failed promises
- **Fallback**: Sets to null if request failed

**`fetchUserSession()`**
- **Purpose**: Retrieves current user authentication state from server
- **Execution Context**: Runs on Next.js server during SSR
- **Use Case**: Determines if user is logged in before page renders
- **Return Type**: Promise<ApiResponse<AuthState>>

**Global Data Structure**
```tsx
globalData = {
  config: ConfigData | null,    // App configuration
  auth: AuthState | null,       // User authentication state
}
```

**Error Handling Strategy**
- **Outer try/catch**: Catches any unexpected errors in the data fetching process
- **Individual status checks**: Handle per-request failures gracefully
- **Fallback behavior**: App continues to work even if some global data fails

**Benefits:**
- User authentication state available immediately
- App configuration loaded once
- No authentication checks needed in individual pages
- Consistent global state across route changes

### 2. Page-Level: View-Specific Data

Each page fetches only the data it needs and hydrates it into view-specific stores:

```tsx
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch data specific to this view
  let dashboardData = {};
  
  try {
    const [analyticsResponse, recentActivityResponse] = await Promise.allSettled([
      fetchAnalytics(),
      fetchRecentActivity(),
    ]);
    
    dashboardData = {
      analytics: analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.result : null,
      recentActivity: recentActivityResponse.status === 'fulfilled' ? recentActivityResponse.value.result : null,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardProvider initialData={dashboardData}>
        <AnalyticsWidget />
        <RecentActivityWidget />
      </DashboardProvider>
    </div>
  );
}
```

#### Method Breakdown:

**`export default async function DashboardPage()`**
- **Purpose**: Server Component that renders the dashboard page
- **Execution Context**: Runs on Next.js server during page rendering
- **Data Flow**: Fetches data → Renders HTML → Sends to client

**`fetchAnalytics()` and `fetchRecentActivity()`**
- **Purpose**: Page-specific API calls for dashboard data
- **Scope**: Only needed for this particular view
- **Execution**: Run in parallel using Promise.allSettled
- **Location**: Typically defined in `src/lib/api/dashboard.ts`

**`<DashboardProvider initialData={dashboardData}>`**
- **Purpose**: Creates a scoped Jotai provider for dashboard-specific atoms
- **Scope**: Only affects child components within this provider
- **Data**: Hydrates dashboard atoms with the fetched data
- **Isolation**: Doesn't interfere with global or other page stores

**Page-Specific Data Structure**
```tsx
dashboardData = {
  analytics: AnalyticsData | null,      // Charts, metrics, KPIs
  recentActivity: ActivityData | null,  // Recent user actions
}
```

**Child Component Access**
- `<AnalyticsWidget />`: Can access analytics data via dashboard atoms
- `<RecentActivityWidget />`: Can access activity data via dashboard atoms
- Both components get data immediately without additional API calls

### 3. View-Specific Providers

Create providers for each major section that need their own data:

```tsx
// src/components/dashboard/dashboard-provider.tsx
'use client';

import { ReactNode } from 'react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { analyticsAtom, recentActivityAtom } from '@/store/dashboard';

interface DashboardProviderProps {
  children: ReactNode;
  initialData?: {
    analytics?: AnalyticsData;
    recentActivity?: ActivityData;
  };
}

export function DashboardProvider({ children, initialData }: DashboardProviderProps) {
  return (
    <Provider>
      <HydrateDashboardAtoms initialData={initialData}>
        {children}
      </HydrateDashboardAtoms>
    </Provider>
  );
}

function HydrateDashboardAtoms({ children, initialData }: { children: ReactNode; initialData?: any }) {
  const hydrateAtoms: [any, any][] = [];
  
  if (initialData?.analytics) {
    hydrateAtoms.push([analyticsAtom, {
      data: initialData.analytics,
      isLoading: false,
      error: null,
    }]);
  }
  
  if (initialData?.recentActivity) {
    hydrateAtoms.push([recentActivityAtom, {
      data: initialData.recentActivity,
      isLoading: false,
      error: null,
    }]);
  }
  
  useHydrateAtoms(hydrateAtoms);
  
  return <>{children}</>;
}
```

#### Method Breakdown:

**`'use client'` Directive**
- **Purpose**: Marks this as a Client Component
- **Requirement**: Needed because we're using Jotai hooks and React context
- **Execution**: This component runs in the browser, not on the server

**`<Provider>` (Jotai Provider)**
- **Purpose**: Creates an isolated Jotai store scope for dashboard data
- **Isolation**: Child components can only access atoms within this provider
- **Nesting**: This provider is nested inside the global provider from root layout
- **Benefit**: Prevents data leakage between different page sections

**`function HydrateDashboardAtoms()`**
- **Purpose**: Hydrates dashboard-specific atoms with server data
- **Execution**: Runs during initial client render
- **Pattern**: Similar to global hydration but scoped to dashboard data

**`hydrateAtoms.push([analyticsAtom, {...}])`**
- **Purpose**: Adds analytics atom to hydration list
- **Structure**: [AtomInstance, InitialValue] tuple
- **Data Shape**: Wraps raw data in state object with loading/error flags
- **Atom Reference**: `analyticsAtom` imported from dashboard store

**Store Isolation Strategy**
```tsx
Root Provider (Global)
├── authAtom (available everywhere)
├── configAtom (available everywhere)
└── Dashboard Provider (Scoped)
    ├── analyticsAtom (dashboard only)
    └── recentActivityAtom (dashboard only)
```

**Benefits of Scoped Providers:**
- **Data Locality**: Dashboard data only exists where needed
- **Memory Efficiency**: Data is garbage collected when leaving the page
- **Type Safety**: Different providers can have different atom types
- **Testing**: Easier to test individual sections in isolation

## Complete Example: User Profile Page

### 1. Store Definition

```tsx
// src/store/profile.ts
import { atom } from 'jotai';

export interface ProfileState {
  profile: UserProfile | null;
  posts: Post[] | null;
  followers: User[] | null;
  isLoading: boolean;
  error: string | null;
}

// Profile atoms
export const profileAtom = atom<ProfileState>({
  profile: null,
  posts: null,
  followers: null,
  isLoading: false,
  error: null,
});

// Derived atoms
export const profileDataAtom = atom((get) => get(profileAtom).profile);
export const postsDataAtom = atom((get) => get(profileAtom).posts);
export const followersDataAtom = atom((get) => get(profileAtom).followers);

// Update atom
export const updateProfileAtom = atom(
  null,
  (get, set, update: Partial<ProfileState>) => {
    const current = get(profileAtom);
    set(profileAtom, { ...current, ...update });
  }
);
```

### 2. Data Fetching Functions

```tsx
// src/lib/api/profile.ts
export async function fetchUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function fetchUserPosts(userId: string): Promise<ApiResponse<Post[]>> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function fetchUserFollowers(userId: string): Promise<ApiResponse<User[]>> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`);
  if (!response.ok) throw new Error('Failed to fetch followers');
  return response.json();
}
```

### 3. Page Implementation

```tsx
// src/app/profile/[userId]/page.tsx
import { fetchUserProfile, fetchUserPosts, fetchUserFollowers } from '@/lib/api/profile';
import { ProfileProvider } from '@/components/profile/profile-provider';
import ProfileHeader from '@/components/profile/profile-header';
import ProfilePosts from '@/components/profile/profile-posts';
import ProfileSidebar from '@/components/profile/profile-sidebar';

interface ProfilePageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;
  
  // Fetch all profile-related data in parallel
  let profileData = {};
  
  try {
    const [profileResponse, postsResponse, followersResponse] = await Promise.allSettled([
      fetchUserProfile(userId),
      fetchUserPosts(userId),
      fetchUserFollowers(userId),
    ]);
    
    profileData = {
      profile: profileResponse.status === 'fulfilled' ? profileResponse.value.result : null,
      posts: postsResponse.status === 'fulfilled' ? postsResponse.value.result : null,
      followers: followersResponse.status === 'fulfilled' ? followersResponse.value.result : null,
    };
  } catch (error) {
    console.error(`Failed to fetch profile data for user ${userId}:`, error);
  }

  return (
    <div className="profile-page">
      <ProfileProvider initialData={profileData}>
        <div className="grid">
          <div className="col-12 md:col-8">
            <ProfileHeader />
            <ProfilePosts />
          </div>
          <div className="col-12 md:col-4">
            <ProfileSidebar />
          </div>
        </div>
      </ProfileProvider>
    </div>
  );
}

// Generate metadata using the fetched data
export async function generateMetadata({ params }: ProfilePageProps) {
  try {
    const profile = await fetchUserProfile(params.userId);
    return {
      title: `${profile.result.name} - Profile`,
      description: `View ${profile.result.name}'s profile, posts, and followers`,
    };
  } catch {
    return {
      title: 'User Profile',
      description: 'View user profile',
    };
  }
}
```

#### Method Breakdown:

**`interface ProfilePageProps`**
- **Purpose**: TypeScript interface defining the page component props
- **params**: Contains dynamic route parameters from Next.js file-based routing
- **userId**: Extracted from the `[userId]` folder name in the file path

**`export default async function ProfilePage({ params })`**
- **async**: Makes this a Server Component that can use await
- **params**: Provided by Next.js, contains route parameters
- **Execution**: Runs on the server during page rendering

**`const { userId } = params`**
- **Destructuring**: Extracts userId from the params object
- **Source**: Comes from the dynamic route segment `[userId]`
- **Example**: For URL `/profile/123`, userId would be `"123"`

**Parallel Data Fetching Strategy**
```tsx
const [profileResponse, postsResponse, followersResponse] = await Promise.allSettled([
  fetchUserProfile(userId),     // GET /api/users/123
  fetchUserPosts(userId),       // GET /api/users/123/posts
  fetchUserFollowers(userId),   // GET /api/users/123/followers
]);
```

**`fetchUserProfile(userId)`**
- **Purpose**: Fetches basic user information (name, bio, avatar, etc.)
- **API Call**: Makes HTTP request to your backend server
- **Return Type**: Promise<ApiResponse<UserProfile>>
- **Usage**: Primary data needed for profile display

**`fetchUserPosts(userId)` and `fetchUserFollowers(userId)`**
- **Purpose**: Fetch related data for the profile page
- **Parallel Execution**: Run simultaneously with Promise.allSettled
- **Optional Data**: Page still works if these fail
- **Performance**: Faster than sequential requests

**Data Structure Assembly**
```tsx
profileData = {
  profile: UserProfile | null,    // Basic user info
  posts: Post[] | null,          // User's posts
  followers: User[] | null,      // User's followers
}
```

**Component Composition**
- `<ProfileHeader />`: Uses profile data from atoms
- `<ProfilePosts />`: Uses posts data from atoms  
- `<ProfileSidebar />`: Uses followers data from atoms
- All get data immediately without additional API calls

**`export async function generateMetadata()`**
- **Purpose**: Next.js function for generating page metadata (title, description)
- **SEO Benefit**: Creates proper meta tags for search engines and social sharing
- **Data Access**: Can fetch data specifically for metadata generation
- **Fallback**: Provides default metadata if data fetching fails

### 4. Profile Provider

```tsx
// src/components/profile/profile-provider.tsx
'use client';

import { ReactNode } from 'react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { profileAtom } from '@/store/profile';
import { UserProfile, Post, User } from '@/types';

interface ProfileProviderProps {
  children: ReactNode;
  initialData?: {
    profile?: UserProfile;
    posts?: Post[];
    followers?: User[];
  };
}

export function ProfileProvider({ children, initialData }: ProfileProviderProps) {
  return (
    <Provider>
      <HydrateProfileAtoms initialData={initialData}>
        {children}
      </HydrateProfileAtoms>
    </Provider>
  );
}

function HydrateProfileAtoms({ 
  children, 
  initialData 
}: { 
  children: ReactNode; 
  initialData?: ProfileProviderProps['initialData']; 
}) {
  const hydrateAtoms: [any, any][] = [];
  
  if (initialData) {
    hydrateAtoms.push([profileAtom, {
      profile: initialData.profile || null,
      posts: initialData.posts || null,
      followers: initialData.followers || null,
      isLoading: false,
      error: null,
    }]);
  }
  
  useHydrateAtoms(hydrateAtoms);
  
  return <>{children}</>;
}
```

### 5. Component Usage

```tsx
// src/components/profile/profile-header.tsx
'use client';

import { useAtomValue } from 'jotai';
import { profileDataAtom, followersDataAtom } from '@/store/profile';

export default function ProfileHeader() {
  const profile = useAtomValue(profileDataAtom);
  const followers = useAtomValue(followersDataAtom);
  
  if (!profile) return <div>Profile not found</div>;
  
  return (
    <div className="profile-header">
      <img src={profile.avatar} alt={profile.name} />
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
      <div className="stats">
        <span>{followers?.length || 0} followers</span>
        <span>{profile.following_count} following</span>
      </div>
    </div>
  );
}
```

## Advanced Patterns

### 1. Nested Data Fetching

For complex pages with multiple data dependencies:

```tsx
// src/app/marketplace/[category]/[productId]/page.tsx
export default async function ProductPage({ params }: { params: { category: string; productId: string } }) {
  const { category, productId } = params;
  
  // Fetch data with dependencies
  let productData = {};
  
  try {
    // First fetch the product
    const productResponse = await fetchProduct(productId);
    const product = productResponse.result;
    
    // Then fetch related data based on product info
    const [reviewsResponse, relatedResponse, sellerResponse] = await Promise.allSettled([
      fetchProductReviews(productId),
      fetchRelatedProducts(product.category, productId),
      fetchSellerInfo(product.seller_id),
    ]);
    
    productData = {
      product,
      reviews: reviewsResponse.status === 'fulfilled' ? reviewsResponse.value.result : null,
      related: relatedResponse.status === 'fulfilled' ? relatedResponse.value.result : null,
      seller: sellerResponse.status === 'fulfilled' ? sellerResponse.value.result : null,
    };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
  }

  return (
    <ProductProvider initialData={productData}>
      <ProductDetails />
      <ProductReviews />
      <RelatedProducts />
      <SellerInfo />
    </ProductProvider>
  );
}
```

### 2. Conditional Data Fetching

Fetch different data based on user permissions or state:

```tsx
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  // Access global auth state (available from root layout)
  const authHeader = headers();
  const userRole = getUserRoleFromHeaders(authHeader);
  
  let dashboardData = {};
  
  try {
    const promises = [
      fetchBasicStats(), // Available to all users
    ];
    
    // Conditional data fetching based on user role
    if (userRole === 'admin') {
      promises.push(
        fetchAdminAnalytics(),
        fetchUserManagement(),
        fetchSystemHealth()
      );
    } else if (userRole === 'manager') {
      promises.push(
        fetchTeamAnalytics(),
        fetchTeamMembers()
      );
    }
    
    const responses = await Promise.allSettled(promises);
    
    dashboardData = {
      basicStats: responses[0].status === 'fulfilled' ? responses[0].value.result : null,
      adminAnalytics: userRole === 'admin' && responses[1].status === 'fulfilled' ? responses[1].value.result : null,
      userManagement: userRole === 'admin' && responses[2].status === 'fulfilled' ? responses[2].value.result : null,
      systemHealth: userRole === 'admin' && responses[3].status === 'fulfilled' ? responses[3].value.result : null,
      teamAnalytics: userRole === 'manager' && responses[1].status === 'fulfilled' ? responses[1].value.result : null,
      teamMembers: userRole === 'manager' && responses[2].status === 'fulfilled' ? responses[2].value.result : null,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }

  return (
    <DashboardProvider initialData={dashboardData} userRole={userRole}>
      <DashboardContent />
    </DashboardProvider>
  );
}
```

### 3. Shared Data Between Views

For data that's shared between multiple views but not global:

```tsx
// src/store/shared.ts
export const sharedDataAtom = atom<SharedDataState>({
  categories: null,
  tags: null,
  popularItems: null,
  isLoading: false,
  error: null,
});

// src/app/(shop)/layout.tsx - Shop section layout
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // Fetch data shared across all shop pages
  let shopData = {};
  
  try {
    const [categoriesResponse, tagsResponse, popularResponse] = await Promise.allSettled([
      fetchCategories(),
      fetchTags(),
      fetchPopularItems(),
    ]);
    
    shopData = {
      categories: categoriesResponse.status === 'fulfilled' ? categoriesResponse.value.result : null,
      tags: tagsResponse.status === 'fulfilled' ? tagsResponse.value.result : null,
      popularItems: popularResponse.status === 'fulfilled' ? popularResponse.value.result : null,
    };
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
  }

  return (
    <ShopProvider initialData={shopData}>
      <div className="shop-layout">
        <ShopSidebar />
        <main>{children}</main>
      </div>
    </ShopProvider>
  );
}
```

## Best Practices

### 1. Data Locality Principle
- **Global data** → Root layout (auth, config, theme)
- **Section data** → Section layout (navigation, shared resources)
- **Page data** → Page component (specific content)
- **Component data** → Component level (form state, UI state)

### 2. Error Handling Strategy
```tsx
// Always use Promise.allSettled for parallel requests
const responses = await Promise.allSettled([
  fetchCriticalData(),    // Must have
  fetchOptionalData(),    // Nice to have
  fetchEnhancementData(), // Enhancement
]);

// Handle each response appropriately
const data = {
  critical: responses[0].status === 'fulfilled' ? responses[0].value : null,
  optional: responses[1].status === 'fulfilled' ? responses[1].value : null,
  enhancement: responses[2].status === 'fulfilled' ? responses[2].value : null,
};
```

### 3. Performance Optimization
```tsx
// Use parallel fetching whenever possible
const [userData, settingsData, preferencesData] = await Promise.all([
  fetchUserData(userId),
  fetchUserSettings(userId),
  fetchUserPreferences(userId),
]);

// Consider request prioritization
const criticalData = await fetchCriticalData(); // Must complete first
const [optionalData1, optionalData2] = await Promise.all([
  fetchOptionalData1(),
  fetchOptionalData2(),
]);
```

### 4. Cache Considerations
```tsx
// Add appropriate cache headers for different data types
export async function fetchStaticContent() {
  return fetch('/api/content', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
}

export async function fetchUserSpecificData(userId: string) {
  return fetch(`/api/users/${userId}`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });
}
```

## Migration Strategy

### 1. Identify Data Categories
- Audit existing data fetching patterns
- Categorize data by scope (global, section, page, component)
- Plan the migration order (start with global data)

### 2. Create Store Architecture
- Define atoms for each data category
- Create provider components for each level
- Implement hydration utilities

### 3. Migrate Incrementally
- Start with global data in root layout
- Move section data to appropriate layouts
- Convert page components one by one
- Update child components to use stores

This pattern provides a scalable, maintainable approach to data fetching that leverages both SSR performance benefits and client-side state management convenience.