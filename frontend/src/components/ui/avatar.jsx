export function Avatar({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-block rounded-full overflow-hidden bg-gray-200 ${className}`}
      style={{ width: 40, height: 40, ...props.style }}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt = "", ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      {...props}
    />
  );
}

export function AvatarFallback({ children }) {
  return (
    <span className="flex items-center justify-center w-full h-full text-gray-500 text-lg">
      {children}
    </span>
  );
} 