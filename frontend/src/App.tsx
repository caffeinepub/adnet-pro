import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/layout/AppLayout';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import DirectorRegistrationPage from './pages/DirectorRegistrationPage';
import ProductionHouseRegistrationPage from './pages/ProductionHouseRegistrationPage';

function RootComponent() {
  return (
    <AppLayout>
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

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration',
  component: RegistrationPage,
});

const registrationSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration/success',
  component: RegistrationSuccessPage,
});

const directorRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/director-registration',
  component: DirectorRegistrationPage,
});

const productionHouseRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production-house-registration',
  component: ProductionHouseRegistrationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  dashboardRoute,
  connectionsRoute,
  registrationRoute,
  registrationSuccessRoute,
  directorRegistrationRoute,
  productionHouseRegistrationRoute,
]);

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
