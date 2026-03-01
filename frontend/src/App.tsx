import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetup from './components/ProfileSetup';
import AppLayout from './components/layout/AppLayout';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import LandingPage from './pages/LandingPage';

function RootComponent() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity && loginStatus === 'success';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppLayout>
      {showProfileSetup && <ProfileSetup />}
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
  beforeLoad: ({ context }) => {
    const identity = (context as any).identity;
    if (!identity) {
      throw redirect({ to: '/' });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    const identity = (context as any).identity;
    if (!identity) {
      throw redirect({ to: '/' });
    }
  },
});

const connectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connections',
  component: ConnectionsPage,
  beforeLoad: ({ context }) => {
    const identity = (context as any).identity;
    if (!identity) {
      throw redirect({ to: '/' });
    }
  },
});

const routeTree = rootRoute.addChildren([indexRoute, profileRoute, dashboardRoute, connectionsRoute]);

const router = createRouter({ 
  routeTree,
  context: { identity: undefined },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity } = useInternetIdentity();
  
  return <RouterProvider router={router} context={{ identity }} />;
}
