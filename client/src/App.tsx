import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedAuthRoute from './routes/ProtectedAuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<ProtectedAuthRoute><LoginPage /></ProtectedAuthRoute>} />
          <Route path="/signup" element={<ProtectedAuthRoute><SignupPage /></ProtectedAuthRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
