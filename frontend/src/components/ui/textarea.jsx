import React from "react"

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
))

Textarea.displayName = "Textarea"

export { Textarea }