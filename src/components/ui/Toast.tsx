"use client";

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 icon-emerald-500',
    error: 'bg-rose-50 border-rose-200 text-rose-800 icon-rose-500',
    info: 'bg-blue-50 border-blue-200 text-blue-800 icon-blue-500',
  };

  const Icons = {
    success: <CheckCircle className="text-emerald-500" size={18} />,
    error: <XCircle className="text-rose-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl animate-in slide-in-from-bottom-5 duration-300 ${styles[type]}`}>
      {Icons[type]}
      <span className="text-sm font-black tracking-tight">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}