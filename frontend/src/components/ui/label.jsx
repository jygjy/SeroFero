import React from "react";
export function Label({ children, className = "", ...props }) {
  return (
    <label className={`block ${className}`} {...props}>
      {children}
    </label>
  );
}