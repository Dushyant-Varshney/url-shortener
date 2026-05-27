import * as React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-white/10 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center'>
          <p className='text-slate-500 text-sm'>
            © {currentYear} URL Shortener. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
