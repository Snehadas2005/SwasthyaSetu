import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

// Toast Notification Component
export const Toast = ({ type = 'info', message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4`}>
        <div className=\"flex items-start\">
          <Icon className={`${config.iconColor} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
          <div className={`${config.textColor} text-sm font-medium flex-1`}>
            {message}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`${config.textColor} hover:opacity-75 ml-3 flex-shrink-0`}
          >
            <X className=\"w-4 h-4\" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md', closeOnOverlay = true }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full'
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className=\"fixed inset-0 z-50 overflow-y-auto\">
      <div className=\"flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0\">
        {/* Overlay */}
        <div 
          className=\"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity\"
          onClick={closeOnOverlay ? onClose : undefined}
        />

        {/* Modal Panel */}
        <div className=\"inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full\">
          <div className={`${sizeClasses[size]} mx-auto`}>
            {/* Header */}
            {title && (
              <div className=\"bg-white px-6 py-4 border-b border-gray-200\">
                <div className=\"flex items-center justify-between\">
                  <h3 className=\"text-lg font-medium text-gray-900\">{title}</h3>
                  <button
                    onClick={onClose}
                    className=\"text-gray-400 hover:text-gray-600 transition-colors\"
                  >
                    <X className=\"w-6 h-6\" />
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className=\"bg-white px-6 py-4\">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className=\"animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2\" />
      )}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', padding = 'p-6', shadow = 'shadow-lg', rounded = 'rounded-lg' }) => {
  return (
    <div className={`bg-white ${shadow} ${rounded} ${padding} ${className}`}>
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className=\"w-full\">
      {label && (
        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
          {label}
        </label>
      )}
      <div className=\"relative\">
        {Icon && (
          <div className=\"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none\">
            <Icon className=\"h-5 w-5 text-gray-400\" />
          </div>
        )}
        <input
          type={type}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className=\"mt-1 text-sm text-red-600\">{error}</p>
      )}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ value, max = 100, color = 'blue', size = 'md', showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className=\"w-full\">
      {showLabel && (
        <div className=\"flex justify-between text-sm text-gray-600 mb-1\">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>
        <div 
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
