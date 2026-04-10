import { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
  isNew?: boolean;
  onPreview?: () => void;
}

export default function NewsCard({ article, isNew = false, onPreview }: NewsCardProps) {
  return (
    <div className="group block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 leading-snug"
            onClick={() => onPreview && onPreview()}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {article.lastModifiedTime}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
              NEW
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600 whitespace-nowrap">
            {article.source}
          </span>
        </div>
      </div>
      
      {/* View Options */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Open in new tab →
        </a>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview && onPreview()}
            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onPreview && onPreview()}
            className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Read
          </button>
        </div>
      </div>
    </div>
  );
}
