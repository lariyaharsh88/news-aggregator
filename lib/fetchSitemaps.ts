import { XMLParser } from "fast-xml-parser";
import { NewsArticle, SitemapSource } from "./types";

// Hardcoded sitemap sources
const SITEMAP_SOURCES: SitemapSource[] = [
  { url: "https://www.shiksha.com/NewsIndex1.xml", name: "Shiksha" },
  { url: "https://collegedunia.com/sitemap-news-updates.xml", name: "CollegeDunia" },
  { url: "https://news.careers360.com/news-sitemap.xml", name: "Careers360" },
  { url: "https://www.jagranjosh.com/newsitemap-news-english.xml", name: "Jagran Josh" },
  { url: "https://testbook.com/news/post-sitemap.xml", name: "Testbook" },
];

/**
 * Get today's date in IST timezone (YYYY-MM-DD format)
 */
function getTodayIST(): string {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Extract title from URL slug
 */
function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Get the last segment of the path
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    // Remove file extensions and clean up
    const slug = lastSegment.replace(/\.(html|htm|php|aspx?)$/i, '');
    
    // Convert hyphens/underscores to spaces and capitalize
    const title = slug
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return title || 'Untitled Article';
  } catch {
    return 'Untitled Article';
  }
}

/**
 * Format lastmod date to IST time string
 */
function formatLastModTime(lastmod: string): string {
  try {
    const date = new Date(lastmod);
    
    // Format in IST
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    
    return date.toLocaleTimeString('en-IN', options);
  } catch {
    return 'Unknown time';
  }
}

/**
 * Check if a date string matches today in IST
 */
function isToday(dateString: string): boolean {
  try {
    const today = getTodayIST();
    const articleDate = dateString.split('T')[0]; // Get YYYY-MM-DD part
    return articleDate === today;
  } catch {
    return false;
  }
}

/**
 * Fetch and parse a single sitemap
 */
async function fetchSingleSitemap(source: SitemapSource): Promise<NewsArticle[]> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 0 }, // No caching
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${source.name}: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xmlText);
    
    // Handle different XML structures
    let urls: any[] = [];
    
    if (result.urlset?.url) {
      urls = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
    } else if (result.sitemapindex?.sitemap) {
      // Some sitemaps might be sitemap indexes
      urls = Array.isArray(result.sitemapindex.sitemap) 
        ? result.sitemapindex.sitemap 
        : [result.sitemapindex.sitemap];
    }

    // Filter and map articles
    const articles: NewsArticle[] = urls
      .filter((item) => {
        const lastmod = item.lastmod || item['news:publication_date'] || '';
        return lastmod && isToday(lastmod);
      })
      .map((item) => {
        const url = item.loc || '';
        const lastmod = item.lastmod || item['news:publication_date'] || '';
        
        return {
          url,
          lastmod,
          source: source.name,
          title: extractTitleFromUrl(url),
          lastModifiedTime: formatLastModTime(lastmod),
        };
      });

    return articles;
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error);
    return [];
  }
}

/**
 * Fetch all sitemaps in parallel and aggregate results
 */
export async function fetchAllSitemaps(): Promise<NewsArticle[]> {
  try {
    // Fetch all sitemaps in parallel
    const results = await Promise.allSettled(
      SITEMAP_SOURCES.map((source) => fetchSingleSitemap(source))
    );

    // Combine all successful results
    const allArticles: NewsArticle[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        console.error(`Failed to fetch ${SITEMAP_SOURCES[index].name}:`, result.reason);
      }
    });

    // Sort by lastmod DESC (latest first)
    allArticles.sort((a, b) => {
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    });

    return allArticles;
  } catch (error) {
    console.error('Error fetching sitemaps:', error);
    return [];
  }
}

/**
 * Get unique source names from articles
 */
export function getUniqueSources(articles: NewsArticle[]): string[] {
  const sources = new Set(articles.map((article) => article.source));
  return Array.from(sources).sort();
}
