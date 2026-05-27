import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='sticky top-0 z-50 glass-effect-lg border-b border-white/10 backdrop-blur-xl'>
      <div className='container mx-auto px-4 py-4 md:py-5'>
        <nav className='flex items-center justify-between'>
          {/* Logo */}
          <div className='text-white font-bold text-lg'>shortlink</div>

          {/* User Menu */}
          {user && (
            <div className='relative'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all'
              >
                <div className='w-2 h-2 rounded-full bg-purple-400'></div>
                <span className='text-sm text-white hidden sm:inline'>{user.name}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='absolute right-0 mt-2 w-56 glass-effect-lg border border-white/10 rounded-lg overflow-hidden shadow-lg'
                >
                  <div className='px-4 py-3 border-b border-white/10'>
                    <p className='text-sm text-slate-300 font-medium'>{user.name}</p>
                    <p className='text-sm text-slate-300 break-all'>{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
