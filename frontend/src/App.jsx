import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import {
  HomePage, AddPlacePage, LoginPage, NotFoundPage, RegisterPage, EditPlacePage
} from './pages';


function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="add-place" element={<AddPlacePage />} />
      <Route path="places/:id/edit" element={<EditPlacePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}

export default App;
