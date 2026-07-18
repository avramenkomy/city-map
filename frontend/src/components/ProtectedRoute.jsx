import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';
import PageLoader from './PageLoader';


function ProtectedRoute() {
  if (!authStore.isAuthChecked) {
    return <PageLoader />;
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default observer(ProtectedRoute);
