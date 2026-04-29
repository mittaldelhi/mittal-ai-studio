export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`premium-container ${className}`}>{children}</div>;
}
