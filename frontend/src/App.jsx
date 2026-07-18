import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestOnlyRoute from './components/GuestOnlyRoute';

import {
  HomePage, AddPlacePage, LoginPage, NotFoundPage, RegisterPage, EditPlacePage,
  MyPlacesPage, FeedbackPage
} from './pages';


function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="feedback" element={<FeedbackPage />} />

      <Route element={<GuestOnlyRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="add-place" element={<AddPlacePage />} />
        <Route path="my-places" element={<MyPlacesPage />} />
        <Route path="places/:id/edit" element={<EditPlacePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}

export default App;
