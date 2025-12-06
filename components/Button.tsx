import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'white';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "px-8 py-3 transition-all duration-300 font-medium text-sm uppercase tracking-wider transform hover:-translate-y-0.5 rounded-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    white: "bg-white text-secondary hover:bg-primary-50 shadow-md"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;