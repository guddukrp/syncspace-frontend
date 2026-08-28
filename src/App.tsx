import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import { APP_ROUTES } from './constants/routes';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import WorkspaceDetailsPage from './pages/WorkspaceDetailsPage';
import WorkspacesPage from './pages/WorkspacesPage';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />
        <Route path={APP_ROUTES.register} element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={APP_ROUTES.projects} element={<ProjectsPage />} />
            <Route path={APP_ROUTES.workspaces} element={<WorkspacesPage />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetailsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={APP_ROUTES.dashboard} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
