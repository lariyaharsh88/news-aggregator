"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "@/lib/types";
import NewsCard from "./NewsCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import ArticlePreviewModal from "./ArticlePreviewModal";

interface NewsDashboardProps {
  initialArticles: NewsArticle[];
  initialSources: string[];
}

export default function NewsDashboard({
  initialArticles,
  initialSources,
}: NewsDashboardProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>(initialArticles);
  const [sources, setSources] = useState<string[]>(initialSources);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(initialSources)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [seenArticleUrls, setSeenArticleUrls] = useState<Set<string>>(new Set(initialArticles.map(a => a.url)));
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Initialize dark mode on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Request notification permissions on first load
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isDarkMode]);

  // Filter articles based on selected sources
  useEffect(() => {
    if (selectedSources.size === 0) {
      setArticles([]);
    } else if (selectedSources.size === sources.length) {
      setArticles(allArticles);
    } else {
      const filtered = allArticles.filter((article) =>
        selectedSources.has(article.source)
      );
      setArticles(filtered);
    }
  }, [selectedSources, allArticles, sources.length]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      
      // Check for new articles
      const newArticles = data.articles.filter((article: NewsArticle) => !seenArticleUrls.has(article.url));
      
      // Show browser notification if new articles found
      if (newArticles.length > 0 && Notification.permission === "granted") {
        new Notification("New Education News", {
          body: `${newArticles.length} new article${newArticles.length > 1 ? 's' : ''} available`,
          icon: "/favicon.ico"
        });
      }
      
      // Show NEW badges for new articles
      setAllArticles(data.articles);
      
      // Update seen articles after rendering
      setTimeout(() => {
        setSeenArticleUrls(new Set([...seenArticleUrls, ...data.articles.map((a: NewsArticle) => a.url)]));
      }, 5000);
      setSources(data.sources);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing news:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleSource = (source: string) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(source)) {
      newSelected.delete(source);
    } else {
      newSelected.add(source);
    }
    setSelectedSources(newSelected);
  };

  const selectAllSources = () => {
    setSelectedSources(new Set(sources));
  };

  const deselectAllSources = () => {
    setSelectedSources(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
            Latest Education News
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Real-time news aggregated from multiple education portals
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Source Filters */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  Filter by Source:
                </h2>
                <button
                  onClick={selectAllSources}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={deselectAllSources}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <label
                    key={source}
                    className={`inline-flex items-center cursor-pointer px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                      selectedSources.has(source)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.has(source)}
                      onChange={() => toggleSource(source)}
                      className="sr-only"
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Controls Column */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                <svg
                  className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString("en-IN")}
              </p>
              <p className="text-xs text-gray-400">Auto-refresh: 60s</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{articles.length}</span>{" "}
            {articles.length === 1 ? "article" : "articles"}
            {selectedSources.size < sources.length && (
              <span className="text-gray-500">
                {" "}
                from {selectedSources.size} selected{" "}
                {selectedSources.size === 1 ? "source" : "sources"}
              </span>
            )}
          </p>
        </div>

        {/* Content */}
        {isRefreshing && articles.length === 0 ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {articles.map((article, index) => (
              <NewsCard 
                key={`${article.url}-${index}`} 
                article={article} 
                isNew={!seenArticleUrls.has(article.url)}
                onPreview={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        )}
        
        {/* Article Preview Modal */}
        {selectedArticle && (
          <ArticlePreviewModal 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </div>
    </div>
  );
}
