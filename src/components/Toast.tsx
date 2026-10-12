import React from 'react';
import { ToastNotification } from '../types';

interface ToastProps {
  message: string | null;
  icon?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', onClose }) => {
  if (!message) return null;

  return (
    <div className="px-4 py-2.5 rounded-lg bg-[#1d2029] text-[#fdf9f1] text-[13px] font-medium shadow-2xl flex items-center gap-2.5 border border-[#31302b] animate-in fade-in slide-in-from-bottom-3 max-w-[90vw]">
      <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">
        {icon}
      </span>
      <span className="truncate">{message}</span>
      <button
        onClick={onClose}
        className="ml-1 text-[#858793] hover:text-white"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} icon={t.icon} onClose={() => onDismiss(t.id)} />
        </div>
      ))}
    </div>
  );
};
