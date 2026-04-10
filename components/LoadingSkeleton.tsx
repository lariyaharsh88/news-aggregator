export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
