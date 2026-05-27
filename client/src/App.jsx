import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import setupAxiosInterceptor from './utils/axiosConfig';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Container from './components/Container/Container';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// Setup Axios interceptor
setupAxiosInterceptor(() => localStorage.getItem('authToken'));

const DashboardLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* Animated background elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse'></div>
      </div>

      <Header />
      <div className='flex-grow relative z-10'>
        <Container />
      </div>
      <Footer />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500'></div>
          <p className='text-slate-400'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
      />
      <Route
        path='/register'
        element={isAuthenticated ? <Navigate to='/' replace /> : <Register />}
      />

      {/* Protected routes */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position='bottom-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
