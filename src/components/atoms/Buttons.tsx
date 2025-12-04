import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'sidebar';
  className?: string;
  leftIcon?: ReactNode;
}

export const Button = ({ children, variant = 'solid', className, leftIcon, ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    solid: "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_4px_14px_0_rgba(255,20,87,0.39)] hover:shadow-[0_6px_20px_0_rgba(255,20,87,0.23)] hover:-translate-y-px active:translate-y-0",
    outline: "border border-white/20 text-white/80 hover:bg-white/5 hover:border-brand-500 hover:text-brand-500",
    ghost: "text-white/70 hover:bg-white/10 hover:text-brand-500",
    sidebar: "justify-start h-auto py-3 px-4 w-full text-white/70 hover:bg-surface-hover hover:text-white hover:translate-x-1"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};

export const IconButton = ({ children, icon, className, ...props }: any) => {
    return (
        <button 
            className={twMerge("p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center", className)}
            {...props}
        >
            {icon || children}
        </button>
    )
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Switch = ({ checked, onChange, className }: SwitchProps) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={twMerge(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        checked ? "bg-brand-500" : "bg-white/20",
        className
      )}
    >
      <span
        className={twMerge(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
};