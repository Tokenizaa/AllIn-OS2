import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  RouterProvider, 
  Outlet, 
  useLocation 
} from '@tanstack/react-router';

// Global styles
import './index.css';

// Components
import { OSHeader } from './components/OSHeader';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { MLMNetwork } from './components/MLMNetwork';
import { CRMDistributors } from './components/CRMDistributors';
import { ComercialModule } from './components/ComercialModule';
import { FinanceModule } from './components/FinanceModule';
import { CopilotPanel } from './components/CopilotPanel';
import { SystemModule } from './components/SystemModule';

// Global Layout Root Component
const RootLayout = () => {
  const location = useLocation();

  const getModuleTitle = (path: string) => {
    switch (path) {
      case '/': return 'Executive Dashboard';
      case '/network': return 'MLM Network Tree';
      case '/crm': return 'CRM Distributors';
      case '/commercial': return 'Comercial Store';
      case '/finance': return 'Finance Ledger';
      case '/copilot': return 'Executive AI Copilot';
      case '/system': return 'System Settings';
      default: return 'ALLIN OS Core';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden antialiased">
      {/* Top OS Header Bar */}
      <OSHeader currentModule={getModuleTitle(location.pathname)} />
      
      {/* Workspace rail + main body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentPath={location.pathname} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/80">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Routing definition
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ExecutiveDashboard,
});

const networkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/network',
  component: MLMNetwork,
});

const crmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crm',
  component: CRMDistributors,
});

const commercialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/commercial',
  component: ComercialModule,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: FinanceModule,
});

const copilotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/copilot',
  component: CopilotPanel,
});

const systemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/system',
  component: SystemModule,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  networkRoute,
  crmRoute,
  commercialRoute,
  financeRoute,
  copilotRoute,
  systemRoute,
]);

// Instantiate router
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// Register router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// React DOM root mount initiation
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
