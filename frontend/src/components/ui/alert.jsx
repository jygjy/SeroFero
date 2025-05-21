export function Alert({ className = "", children }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <div className="mt-1 text-sm">{children}</div>;
}