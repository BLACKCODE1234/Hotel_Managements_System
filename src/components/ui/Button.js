import React from 'react';
import { classNames } from '../../utils/classNames';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      className={classNames(
        'inline-flex items-center justify-center rounded-md border border-transparent font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={classNames(children ? 'mr-2' : '', 'h-4 w-4')} />}
      {children}
    </button>
  );
};

export default Button;
