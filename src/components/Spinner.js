/**
 * Spinner Component
 * A reusable loading spinner with configurable size
 */

const Spinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-t-2 border-b-2",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-primary ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
