import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = ({ children, variant = 'primary', size = 'md', className, isLoading, ...props }) => {
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20',
    secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
  };
  const sizes = { sm: 'px-4 py-2 text-sm rounded-lg', md: 'px-6 py-3 rounded-xl', lg: 'px-8 py-4 text-lg rounded-2xl' };
  return (
    <button className={cn('inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)} disabled={isLoading} {...props}>
      {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
      {children}
    </button>
  );
};

export default Button;
