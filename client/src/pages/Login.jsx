import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden'>
      {/* Animated background orbs */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse'></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        {/* Card */}
        <div className='glass-effect-lg border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold gradient-text mb-2'>Login</h1>
            <p className='text-slate-400'>Access your shortened URLs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300'
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'
                  className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300'
                />
              </div>
            </motion.div>

            {/* Login button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white'></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className='w-5 h-5' />
                  Login
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center gap-3'>
            <div className='flex-1 h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0'></div>
            <span className='text-xs text-slate-500'>OR</span>
            <div className='flex-1 h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0'></div>
          </div>

          {/* Sign up link */}
          <p className='text-center text-slate-400 text-sm'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-purple-400 hover:text-purple-300 font-medium transition-colors'
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer message */}
        <p className='text-center text-slate-500 text-xs mt-6'>
          By logging in, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
