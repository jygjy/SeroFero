import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.variant === "destructive" ? "#dc2626" : "#334155",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 8,
              minWidth: 220,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: 14,
            }}
          >
            <strong>{t.title}</strong>
            <div>{t.description}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext) || { toast: () => {} };
}