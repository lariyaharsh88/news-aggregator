# Latest Education News Today

A production-ready Next.js application that aggregates news articles in real-time from multiple XML sitemap URLs.

## Features

✅ **Real-time Data Fetching** - Fetches fresh data from XML sitemaps without any database or storage  
✅ **IST Timezone Filtering** - Only shows articles published today in Indian Standard Time  
✅ **Auto-refresh** - Automatically refreshes every 60 seconds  
✅ **Manual Refresh** - Refresh button for on-demand updates  
✅ **Source Filtering** - Filter articles by source with checkboxes  
✅ **Parallel Fetching** - All sitemaps fetched in parallel using Promise.all  
✅ **Error Handling** - Graceful error handling if sitemaps fail  
✅ **Loading States** - Beautiful skeleton loaders  
✅ **Empty States** - User-friendly message when no news is available  
✅ **Responsive Design** - Works on all devices  
✅ **SEO Optimized** - Proper meta tags and page titles

## Data Sources

The application aggregates news from these education portals:

- **Shiksha** - https://www.shiksha.com/NewsIndex1.xml
- **CollegeDunia** - https://collegedunia.com/sitemap-news-updates.xml
- **Careers360** - https://news.careers360.com/news-sitemap.xml
- **Jagran Josh** - https://www.jagranjosh.com/newsitemap-news-english.xml

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **fast-xml-parser** - Lightweight XML parsing

## Project Structure

```
news-aggregator/
├── app/
│   ├── api/
│   │   └── news/
│   │       └── route.ts          # API endpoint for fetching news
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page (server component)
│   └── globals.css               # Global styles
├── components/
│   ├── NewsDashboard.tsx         # Main client component with auto-refresh
│   ├── NewsCard.tsx              # Individual news card component
│   ├── LoadingSkeleton.tsx       # Loading state component
│   └── EmptyState.tsx            # Empty state component
├── lib/
│   ├── fetchSitemaps.ts          # Core fetching and parsing logic
│   └── types.ts                  # TypeScript interfaces
└── package.json
```

## Getting Started

### Installation

```bash
cd news-aggregator
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## How It Works

### 1. Server-Side Initial Fetch
- The main page (`app/page.tsx`) is a server component
- On page load, it fetches all sitemaps in parallel
- Filters articles to only include today's news (IST timezone)
- Passes initial data to the client component

### 2. Client-Side Auto-Refresh
- `NewsDashboard` component handles client-side state
- Auto-refreshes every 60 seconds via `setInterval`
- Manual refresh button available
- Uses `/api/news` endpoint for fresh data

### 3. Filtering Logic
- Only articles with `lastmod` date matching today (IST) are shown
- Articles sorted by `lastmod` DESC (latest first)
- Source filtering via checkboxes (client-side)

### 4. IST Timezone Handling
- All date comparisons use IST (UTC+5:30)
- Properly handles timezone conversion
- Displays times in IST format

## Key Features Explained

### No Database/Storage
- All data fetched fresh from sitemaps on every request
- No caching (using `revalidate: 0` and `force-dynamic`)
- Ensures real-time data

### Parallel Fetching
- Uses `Promise.allSettled()` to fetch all sitemaps simultaneously
- If one sitemap fails, others still load
- Significantly faster than sequential fetching

### Error Handling
- Try-catch blocks around all fetch operations
- Graceful degradation if sitemaps are unavailable
- Console logging for debugging

### Performance
- Server-side rendering for initial load
- Client-side updates for subsequent refreshes
- Optimized re-renders with React hooks

## Environment Variables

No environment variables required! All sitemap URLs are hardcoded as per requirements.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built with ❤️ using Next.js
