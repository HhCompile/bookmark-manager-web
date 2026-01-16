/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'blue-gradient': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        'green-gradient': 'linear-gradient(90deg, #10b981, #059669)',
        'info-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
        'purple-gradient': 'linear-gradient(135deg, #a855f7 0%, #d977fa 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      opacity: {
        15: '0.15',
      },
      colors: {
        surface: '#f8fafc',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-tertiary': '#94a3b8',
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
        secondary: '#6b7280',
      },
      backgroundColor: {
        'primary/10': 'rgba(59, 130, 246, 0.1)',
        'success/10': 'rgba(16, 185, 129, 0.1)',
        'danger/10': 'rgba(239, 68, 68, 0.1)',
        'warning/10': 'rgba(245, 158, 11, 0.1)',
        'info/10': 'rgba(14, 165, 233, 0.1)',
        'secondary/10': 'rgba(107, 114, 128, 0.1)',
        'purple/100': '#f3e8ff',
        'purple/200': '#e9d5ff',
      },
      borderColor: {
        'primary/20': 'rgba(59, 130, 246, 0.2)',
        'success/20': 'rgba(16, 185, 129, 0.2)',
        'danger/20': 'rgba(239, 68, 68, 0.2)',
        'warning/20': 'rgba(245, 158, 11, 0.2)',
        'info/20': 'rgba(14, 165, 233, 0.2)',
        'secondary/20': 'rgba(107, 114, 128, 0.2)',
        'border': '#e2e8f0',
      },
      textColor: {
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
        secondary: '#6b7280',
      },
    },
  },
  plugins: [],
};
