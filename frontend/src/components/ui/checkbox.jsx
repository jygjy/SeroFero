import React from "react";

export const Checkbox = React.forwardRef(
  ({ id, checked, onCheckedChange, ...props }, ref) => (
    <input
      type="checkbox"
      id={id}
      ref={ref}
      checked={checked}
      onChange={e => onCheckedChange?.(e.target.checked)}
      {...props}
      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
    />
  )
);

Checkbox.displayName = "Checkbox";