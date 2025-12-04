import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const baseStyles = "text-white rounded inline-flex items-center justify-center";
  const sizeStyles = size === 'sm' ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  
  const variantStyles = {
    primary: "bg-gray-900",
    success: "bg-green-500",
    warning: "bg-orange-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
  };
  
  return (
    <span className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

