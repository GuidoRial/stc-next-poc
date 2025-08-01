# Server Component Data Passing Patterns (No Prop Drilling)

## Overview

When working with Server Components in Next.js, you cannot use React Context since Server Components run on the server where React context is not available. However, there are several elegant patterns to pass data to nested server components without prop drilling.

## The Problem: No Context in Server Components

```tsx
// ❌ This doesn't work in Server Components
'use server'; // This directive doesn't exist - just for illustration

import { createContext, useContext } from 'react';

const DataContext = createContext(); // Error: Server components can't use context

export default function ServerComponent() {
  const data = useContext(DataContext); // Error: Hooks don't work on server
  return <div>{data.name}</div>;
}
```

**Why Context doesn't work:**
- Server Components run during build time or request time on the server
- React Context is a client-side state management solution
- `useContext` and other hooks are not available in Server Components

## Solution Patterns

### 1. **Direct Props Passing** (Simple but Limited)

For shallow component hierarchies, direct props work fine:

```tsx
// src/app/profile/page.tsx (Server Component)
export default async function ProfilePage() {
  const userData = await fetchUserData();
  
  return (
    <div>
      <ProfileHeader user={userData} />
      <ProfileContent user={userData} />
    </div>
  );
}

// src/components/profile-header.tsx (Server Component)
export default function ProfileHeader({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <UserAvatar user={user} /> {/* Pass down one more level */}
    </div>
  );
}
```

**Pros:** Simple, explicit, type-safe
**Cons:** Becomes unwieldy with deep nesting, violates DRY principle

### 2. **Async Component Composition** (Recommended)

Let each component fetch its own data asynchronously:

```tsx
// src/app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  return (
    <div>
      <DashboardHeader /> {/* Fetches its own data */}
      <DashboardStats />  {/* Fetches its own data */}
      <DashboardCharts /> {/* Fetches its own data */}
    </div>
  );
}

// src/components/dashboard-header.tsx (Server Component)
export default async function DashboardHeader() {
  // Each component is responsible for its own data
  const userStats = await fetchUserStats();
  
  return (
    <div>
      <h1>Welcome back, {userStats.name}!</h1>
      <span>You have {userStats.notifications} notifications</span>
    </div>
  );
}

// src/components/dashboard-stats.tsx (Server Component)
export default async function DashboardStats() {
  // Independent data fetching
  const stats = await fetchDashboardStats();
  
  return (
    <div className="grid">
      {stats.map(stat => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </div>
  );
}
```

**Pros:** 
- No prop drilling
- Each component is self-contained
- Parallel data fetching (faster performance)
- Easy to test and maintain

**Cons:** 
- Multiple API calls (can be optimized with caching)
- Potential data duplication

### 3. **Server-Side Data Store Pattern** (Advanced)

Create a server-side data store that components can access:

```tsx
// src/lib/server-store.ts
const serverDataStore = new Map<string, any>();

export function setServerData<T>(key: string, data: T): void {
  serverDataStore.set(key, data);
}

export function getServerData<T>(key: string): T | null {
  return serverDataStore.get(key) || null;
}

export function clearServerData(): void {
  serverDataStore.clear();
}

// src/app/profile/[userId]/page.tsx (Root Server Component)
import { setServerData } from '@/lib/server-store';

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  // Fetch data once at the top level
  const [userData, postsData, followersData] = await Promise.all([
    fetchUser(params.userId),
    fetchUserPosts(params.userId),
    fetchUserFollowers(params.userId),
  ]);
  
  // Store data in server-side store
  setServerData('currentUser', userData);
  setServerData('userPosts', postsData);
  setServerData('userFollowers', followersData);
  
  return (
    <div>
      <ProfileHeader /> {/* Accesses data from store */}
      <ProfilePosts />  {/* Accesses data from store */}
      <ProfileSidebar /> {/* Accesses data from store */}
    </div>
  );
}

// src/components/profile-header.tsx (Server Component)
import { getServerData } from '@/lib/server-store';

export default function ProfileHeader() {
  // Access data from server store (no props needed!)
  const user = getServerData<User>('currentUser');
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <UserStats userId={user.id} /> {/* Can pass specific needed data */}
    </div>
  );
}

// src/components/profile-posts.tsx (Server Component)
import { getServerData } from '@/lib/server-store';

export default function ProfilePosts() {
  const posts = getServerData<Post[]>('userPosts');
  
  if (!posts) return <div>No posts found</div>;
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Pros:**
- No prop drilling
- Single data fetch per page
- Components remain decoupled
- Easy to share data between distant components

**Cons:**
- Requires cleanup between requests
- Global state can be harder to debug
- Need to handle race conditions

### 4. **Layout-Based Data Passing**

Use Next.js layouts to provide data to multiple pages:

```tsx
// src/app/(dashboard)/layout.tsx
export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Fetch shared data for all dashboard pages
  const userData = await fetchCurrentUser();
  const navData = await fetchNavigationData();
  
  return (
    <div className="dashboard-layout">
      <DashboardSidebar user={userData} navigation={navData} />
      <main>
        {/* Pages can't directly access userData, but can fetch their own */}
        {children}
      </main>
    </div>
  );
}

// src/app/(dashboard)/settings/page.tsx
export default async function SettingsPage() {
  // This page fetches its own data, while layout handles shared UI data
  const settings = await fetchUserSettings();
  
  return (
    <div>
      <SettingsForm settings={settings} />
    </div>
  );
}
```

### 5. **Higher-Order Server Component Pattern**

Create wrapper components that provide data to their children:

```tsx
// src/components/with-user-data.tsx
interface WithUserDataProps {
  userId: string;
  children: (userData: User) => React.ReactNode;
}

export default async function WithUserData({ userId, children }: WithUserDataProps) {
  const userData = await fetchUser(userId);
  
  return (
    <div>
      {children(userData)}
    </div>
  );
}

// Usage in page:
export default function ProfilePage({ params }: { params: { userId: string } }) {
  return (
    <WithUserData userId={params.userId}>
      {(user) => (
        <div>
          <h1>{user.name}</h1>
          <WithUserPosts userId={user.id}>
            {(posts) => (
              <PostList posts={posts} user={user} />
            )}
          </WithUserPosts>
        </div>
      )}
    </WithUserData>
  );
}
```

### 6. **Request-Scoped Data Pattern** (Using Next.js Cache)

Use Next.js caching to avoid duplicate requests:

```tsx
// src/lib/data-fetchers.ts
import { cache } from 'react';

// Cache ensures this function is called only once per request
export const getCurrentUser = cache(async (): Promise<User> => {
  console.log('Fetching user data...'); // Will only log once per request
  const response = await fetch('/api/user');
  return response.json();
});

export const getUserPosts = cache(async (userId: string): Promise<Post[]> => {
  console.log(`Fetching posts for user ${userId}...`); // Only once per request
  const response = await fetch(`/api/users/${userId}/posts`);
  return response.json();
});

// src/app/profile/page.tsx
import { getCurrentUser } from '@/lib/data-fetchers';

export default async function ProfilePage() {
  const user = await getCurrentUser(); // First call
  
  return (
    <div>
      <ProfileHeader /> {/* Will reuse cached data */}
      <ProfileContent />
    </div>
  );
}

// src/components/profile-header.tsx
import { getCurrentUser } from '@/lib/data-fetchers';

export default async function ProfileHeader() {
  const user = await getCurrentUser(); // Reuses cache, no additional API call
  
  return <h1>Welcome, {user.name}!</h1>;
}

// src/components/profile-content.tsx
import { getCurrentUser, getUserPosts } from '@/lib/data-fetchers';

export default async function ProfileContent() {
  const user = await getCurrentUser(); // Reuses cache
  const posts = await getUserPosts(user.id); // First call for posts
  
  return (
    <div>
      <PostList posts={posts} />
      <ProfileStats user={user} posts={posts} />
    </div>
  );
}
```

**Benefits of Request-Scoped Caching:**
- No prop drilling needed
- No duplicate API calls per request
- Each component fetches what it needs
- Automatic cleanup between requests
- Type-safe data access

## Best Practices & Recommendations

### 1. **Choose the Right Pattern**

- **Simple apps (1-2 levels):** Direct props
- **Medium complexity:** Async component composition + caching
- **Complex apps:** Server-side data store or HOC patterns
- **Shared data:** Layout-based or request-scoped caching

### 2. **Performance Considerations**

```tsx
// ✅ Good: Parallel data fetching
export default async function Page() {
  const [userData, postsData, commentsData] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  
  return (
    <div>
      <UserProfile user={userData} />
      <PostsList posts={postsData} />
      <CommentsList comments={commentsData} />
    </div>
  );
}

// ❌ Bad: Sequential data fetching
export default async function Page() {
  const userData = await fetchUser();
  const postsData = await fetchPosts(); // Waits for user to complete
  const commentsData = await fetchComments(); // Waits for posts to complete
  
  return (
    <div>
      <UserProfile user={userData} />
      <PostsList posts={postsData} />
      <CommentsList comments={commentsData} />
    </div>
  );
}
```

### 3. **Error Handling**

```tsx
// src/components/error-boundary-server.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export default function ServerErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Server component error:', error);
    return <>{fallback}</>;
  }
}

// Usage:
export default async function Page() {
  return (
    <div>
      <ServerErrorBoundary fallback={<div>Failed to load user data</div>}>
        <UserProfile />
      </ServerErrorBoundary>
      
      <ServerErrorBoundary fallback={<div>Failed to load posts</div>}>
        <PostsList />
      </ServerErrorBoundary>
    </div>
  );
}
```

### 4. **TypeScript Best Practices**

```tsx
// src/types/server-data.ts
export interface ServerDataMap {
  currentUser: User;
  userPosts: Post[];
  userFollowers: User[];
  appConfig: Config;
}

// src/lib/server-store.ts
import type { ServerDataMap } from '@/types/server-data';

const serverDataStore = new Map<keyof ServerDataMap, any>();

export function setServerData<K extends keyof ServerDataMap>(
  key: K, 
  data: ServerDataMap[K]
): void {
  serverDataStore.set(key, data);
}

export function getServerData<K extends keyof ServerDataMap>(
  key: K
): ServerDataMap[K] | null {
  return serverDataStore.get(key) || null;
}

// Usage with full type safety:
const user = getServerData('currentUser'); // Type: User | null
const posts = getServerData('userPosts'); // Type: Post[] | null
```

## Summary

The key insight is that **Server Components don't need React Context** because they have access to more powerful server-side patterns:

1. **Direct async data fetching** in each component
2. **Request-scoped caching** to avoid duplicate API calls
3. **Server-side data stores** for complex state management
4. **Higher-order components** for data provision patterns

These patterns are often **more performant** than client-side context because they:
- Enable parallel data fetching
- Reduce client-side JavaScript bundle size  
- Provide better SEO with pre-rendered content
- Eliminate client-side loading states

Choose the pattern that best fits your application's complexity and data flow requirements.