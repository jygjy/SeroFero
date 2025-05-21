import React from "react";

export function Tabs({ value, onValueChange, children, className = "", defaultValue }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const activeValue = value !== undefined ? value : internalValue;

  const handleChange = (val) => {
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
  };

  // Clone children and inject props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type.displayName === "TabsList") {
      return React.cloneElement(child, { value: activeValue, onValueChange: handleChange });
    }
    if (child.type.displayName === "TabsContent") {
      return React.cloneElement(child, { activeValue });
    }
    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
}
Tabs.displayName = "Tabs";

export function TabsList({ children, value, onValueChange, className = "" }) {
  // Clone children and inject props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type.displayName === "TabsTrigger") {
      return React.cloneElement(child, {
        active: child.props.value === value,
        onClick: () => onValueChange(child.props.value),
      });
    }
    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ children, value, active, onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`${className} ${active ? "bg-white shadow-sm" : ""}`}
      data-state={active ? "active" : ""}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ value, children, className = "" }) {
  // Get the active tab value from the parent Tabs component
  // We'll use React context for this, but since the current Tabs implementation doesn't use context,
  // we'll pass the value prop down to children and check for a match.
  // To do this, we need to update Tabs to provide the active value to its children via React.cloneElement.
  // But for now, let's use a workaround: Tabs will inject the active value as a prop if the child is TabsContent.
  // So, update Tabs to do this:
  //
  // In Tabs:
  // if (child.type.displayName === "TabsContent") {
  //   return React.cloneElement(child, { activeValue });
  // }
  //
  // And here in TabsContent:
  //
  // if (value !== activeValue) return null;
  //
  // For now, let's implement this logic.

  if (value !== activeValue) return null;

  return <div className={className}>{children}</div>;
}
TabsContent.displayName = "TabsContent";