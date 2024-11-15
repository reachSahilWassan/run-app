import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Run } from "../types";

const ITEMS_PER_PAGE = 15;
const LOADING_DELAY = 1000; // 2 seconds delay

const ListPage = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [visibleRuns, setVisibleRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (runs.length > 0) {
      loadInitialItems();
    }
  }, [runs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (
          firstEntry.isIntersecting &&
          !loadingMore &&
          visibleRuns.length < runs.length
        ) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadingMore, runs, currentPage, visibleRuns.length]);

  const loadInitialItems = async () => {
    try {
      // Ensure loading state shows for at least the delay duration
      await delay(LOADING_DELAY);
      setVisibleRuns(runs.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = useCallback(async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);

      const nextPage = currentPage + 1;
      const endIndex = nextPage * ITEMS_PER_PAGE;

      // Only load more if we haven't shown all items yet
      if (endIndex <= runs.length) {
        console.log(
          `Loading more items. Page ${nextPage}, showing items up to index ${endIndex}`
        );

        // Ensure loading state shows for the full delay duration
        await delay(LOADING_DELAY);

        setVisibleRuns(runs.slice(0, endIndex));
        setCurrentPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, runs, loadingMore]);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data/runs.json");
      if (!response.ok) {
        throw new Error("Failed to fetch runs");
      }
      const data = await response.json();
      // Add artificial delay to initial fetch
      await delay(LOADING_DELAY);
      setRuns(data);
    } catch (err) {
      setError("Failed to load runs. Please try again later.");
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  const hasMore = visibleRuns.length < runs.length;

  // Show loading spinner for initial load
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="list-view mx-5 md:mx-28 border rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Runs</h2>
        <h4 className="text-lg">Your workout details</h4>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-2 md:px-6 py-3 text-start text-xs md:text-sm font-medium text-gray-500 uppercase bg-gray-100"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-2 md:px-6 py-3 text-start text-xs md:text-sm font-medium text-gray-500 uppercase bg-gray-100"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-2 md:px-6 py-3 text-start text-xs md:text-sm font-medium text-gray-500 uppercase bg-gray-100"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-2 md:px-6 py-3 text-end text-xs md:text-sm font-medium text-gray-500 uppercase bg-gray-100"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {visibleRuns.map((run) => (
            <tr key={run.id} className="group">
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 group-hover:bg-gray-50">
                {run.id}
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 group-hover:bg-gray-50">
                <Link
                  to={`/run/${run.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {run.name}
                </Link>
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 group-hover:bg-gray-50">
                {run.status === "Success" ? (
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Success
                  </span>
                ) : run.status === "Failed" ? (
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                )}
              </td>
              <td className="px-2 md:px-6 py-4 text-end text-xs md:text-sm font-medium text-gray-800 group-hover:bg-gray-50">
                {new Date(run.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
        <div ref={loadingRef} className="p-4 text-center">
          {loadingMore ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          ) : (
            <span className="text-gray-500">Scroll to load more</span>
          )}
        </div>
      )}
    </section>
  );
};

export default ListPage;
