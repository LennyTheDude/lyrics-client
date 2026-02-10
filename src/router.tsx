import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import AppLayout from './AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ViewTranslation from './pages/ViewTranslation';
import EditTranslation from './pages/EditTranslation';
import CreateTranslation from './pages/CreateTranslation';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/translation/:id" element={<ViewTranslation />} />
      <Route
        path="/translation/edit/:id"
        element={
          <ProtectedRoute>
            <EditTranslation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/translation/new"
        element={
          <ProtectedRoute>
            <CreateTranslation />
          </ProtectedRoute>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
