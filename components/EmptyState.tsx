export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          No news today
        </h3>
        <p className="mt-2 text-gray-600">
          There are no articles published today from the selected sources.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Check back later or try refreshing the page.
        </p>
      </div>
    </div>
  );
}
