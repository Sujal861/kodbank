import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Balance from './pages/Balance';
import TokenView from './pages/TokenView';
import Transfer from './pages/Transfer';
import History from './pages/History';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(19, 20, 31, 0.97)', color: '#eaeaf5',
            border: '1px solid rgba(232, 64, 87, 0.15)', borderRadius: '10px',
            padding: '12px 16px', fontSize: '0.9rem', fontFamily: "'Outfit', sans-serif",
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)',
          },
          success: { iconTheme: { primary: '#ffc857', secondary: '#1a1800' }, style: { border: '1px solid rgba(255, 200, 87, 0.2)' } },
          error: { iconTheme: { primary: '#e84057', secondary: '#fff' }, style: { border: '1px solid rgba(232, 64, 87, 0.25)' } },
        }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
          <Route path="/token" element={<ProtectedRoute><TokenView /></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
