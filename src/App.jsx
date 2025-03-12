import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import protectedRoutes from './constants/protectedRoutes';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
          {/* Redirect '/' to Dashboard if authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          
          {/* Protected Routes - Dynamically Generated */}
          {protectedRoutes.map(({ path, component }) => (
            <Route key={path} path={path} element={<ProtectedRoute>{component}</ProtectedRoute>}/>
          ))}
      </Routes>
    </Router>
  );
}

export default App;