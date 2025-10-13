import React from 'react';

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  variant = 'primary', // 'primary', 'danger', etc.
  fullWidth = false,
  className = '',
}) => {
  // Base styles
  let baseStyles = "px-4 py-2 font-semibold text-white rounded-lg transition-colors duration-300 disabled:cursor-not-allowed";

  // Variant styles
  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = "bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800";
  } else if (variant === 'danger') {
    variantStyles = "bg-red-600 hover:bg-red-700 disabled:bg-red-800";
  }

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
