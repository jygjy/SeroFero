export function Separator({ className = "", ...props }) {
  return (
    <hr
      className={`my-4 border-t border-gray-200 ${className}`}
      {...props}
    />
  );
}