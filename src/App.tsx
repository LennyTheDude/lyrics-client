import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ViewTranslation from './pages/ViewTranslation';
import EditTranslation from './pages/EditTranslation';
import CreateTranslation from './pages/CreateTranslation';
import NotFound from './pages/NotFound';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* link to signup - uncomment when need to activate signup */}
              {/* <Route path="/signup" element={<Signup />} /> */}
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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
