import React from "react";

export function Select({ value, onValueChange, children, ...props }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      {...props}
      className="block w-full rounded-md border-gray-300 shadow-sm"
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, ...props }) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <option value="">{placeholder}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}