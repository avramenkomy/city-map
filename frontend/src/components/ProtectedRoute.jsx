import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';
import PageLoader from './PageLoader';


function ProtectedRoute() {
  const location = useLocation();

  if (!authStore.isAuthChecked) {
    return <PageLoader />;
  }

  if (!authStore.isAuthenticated) {
    return <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />;
  }

  return <Outlet />;
}

export default observer(ProtectedRoute);
