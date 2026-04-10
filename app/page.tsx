import { fetchAllSitemaps, getUniqueSources } from "@/lib/fetchSitemaps";
import NewsDashboard from "@/components/NewsDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

export const metadata = {
  title: "Latest Education News Today",
  description: "Real-time news aggregated from multiple education portals including Shiksha, CollegeDunia, Careers360, and Jagran Josh",
  keywords: "education news, latest news, college news, career news, education updates",
};

export default async function Home() {
  // Fetch initial data on server
  const articles = await fetchAllSitemaps();
  const sources = getUniqueSources(articles);

  return <NewsDashboard initialArticles={articles} initialSources={sources} />;
}
