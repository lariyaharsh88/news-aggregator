"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "@/lib/types";

interface ArticlePreviewModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export default function ArticlePreviewModal({ article, onClose }: ArticlePreviewModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'reader'>('preview');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/article?url=${encodeURIComponent(article.url)}`);
        const data = await response.json();
        
        if (data.success) {
          setContent(data.htmlContent);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [article]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{article.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{article.source} • {article.lastModifiedTime}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'preview' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('reader')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'reader' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Reader
              </button>
            </div>
            
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Original
            </a>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading article...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.open(article.url, '_blank')}
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Open in new tab instead
              </button>
            </div>
          ) : (
            <div 
              className={`max-w-none ${viewMode === 'reader' ? 'leading-relaxed' : ''}`}
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}