import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Signup from './pages/Signup';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import { isLoggedIn, isAdmin } from './services/api';

// Guard user-only routes: redirect to login if no session token.
function RequireUser({ children }) {
  return isLoggedIn() ? children : <Navigate to="/user-login" replace />;
}

// Guard admin-only routes: redirect to admin login if not authenticated.
function RequireAdmin({ children }) {
  return isAdmin() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* User account flow */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/app" element={<RequireUser><UserDashboard /></RequireUser>} />

        {/* Admin flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
