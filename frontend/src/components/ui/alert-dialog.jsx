import React from "react";

export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}
export function AlertDialogTitle({ children }) {
  return <h3 className="text-lg font-bold mb-2">{children}</h3>;
}
export function AlertDialogDescription({ children }) {
  return <p className="mb-4">{children}</p>;
}
export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
export function AlertDialogCancel({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-gray-300 rounded">
      {children}
    </button>
  );
}
export function AlertDialogAction({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-red-500 text-white rounded ${className || ""}`}>
      {children}
    </button>
  );
}
  