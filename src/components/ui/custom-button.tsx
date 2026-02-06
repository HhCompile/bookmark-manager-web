import { motion } from 'motion/react'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  endIcon?: ReactNode
}

export default function CustomButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  endIcon,
  className = '',
  ...props
}: CustomButtonProps) {
  // 变体样式
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  }

  // 宽度样式
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-3 ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} rounded-xl shadow-lg border-2 border-transparent transition-all ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: variant === 'primary'
          ? '0 25px 50px -12px rgba(59, 130, 246, 0.25)'
          : variant === 'secondary'
          ? '0 25px 50px -12px rgba(75, 85, 99, 0.25)'
          : '0 25px 50px -12px rgba(59, 130, 246, 0.1)'
      }}
      whileTap={{
        scale: 0.98,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}
      {...props}
    >
      {icon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {icon}
        </motion.div>
      )}
      <span className="font-medium">{children}</span>
      {endIcon && (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {endIcon}
        </motion.div>
      )}
    </motion.button>
  )
}
