import React, { useState, cloneElement, createContext, useContext } from "react";

const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  return <>{children}</>;
}

export function Tooltip({ children }) {
  const [open, setOpen] = useState(false);

  // Find TooltipTrigger and TooltipContent among children
  let trigger = null;
  let content = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type.displayName === "TooltipTrigger") {
      trigger = cloneElement(child, {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      });
    }
    if (child.type.displayName === "TooltipContent") {
      content = open ? child : null;
    }
  });

  return (
    <TooltipContext.Provider value={{ open }}>
      <span style={{ position: "relative", display: "inline-block" }}>
        {trigger}
        {content}
      </span>
    </TooltipContext.Provider>
  );
}
Tooltip.displayName = "Tooltip";

export function TooltipTrigger({ children, ...props }) {
  return (
    <span tabIndex={0} {...props} style={{ outline: "none" }}>
      {children}
    </span>
  );
}
TooltipTrigger.displayName = "TooltipTrigger";

export function TooltipContent({ children }) {
  // Simple absolute-positioned tooltip
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 50,
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: 8,
        background: "rgba(55, 65, 81, 0.95)",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        whiteSpace: "pre-line",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
TooltipContent.displayName = "TooltipContent";