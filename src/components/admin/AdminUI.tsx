import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 hover:shadow-lg hover:shadow-blue-500/20',
    secondary: 'border border-white/10 text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  textarea,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const baseClass = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-400/50 transition-colors text-sm';
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}{required && <span className="text-red-400"> *</span>}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows || 3}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  );
}

export function AdminToast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-4 z-[80] px-4 py-3 rounded-xl text-sm backdrop-blur-lg border ${
        type === 'success'
          ? 'bg-green-500/10 text-green-300 border-green-500/20'
          : 'bg-red-500/10 text-red-300 border-red-500/20'
      }`}
    >
      {message}
    </motion.div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
