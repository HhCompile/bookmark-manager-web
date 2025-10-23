import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
          variant === "destructive" && "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
          variant === "outline" && "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md",
          variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100",
          variant === "link" && "underline-offset-4 hover:underline text-blue-600 hover:text-blue-800",
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3 rounded-md",
          size === "lg" && "h-11 px-8 rounded-lg",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };