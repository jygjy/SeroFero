import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export function DialogDescription({ children, className = "" }) {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
}