import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStore';
import PageLoader from './PageLoader';

function GuestOnlyRoute() {
  if (!authStore.isAuthChecked) {
    return <PageLoader />;
  }

  if (authStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default observer(GuestOnlyRoute);
