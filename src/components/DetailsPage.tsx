import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Run } from "../types";


const LOADING_DELAY = 1000; // 2 seconds delay

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("white");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetchRunDetails();
  }, [id]);

  const fetchRunDetails = async () => {
    try {
      await delay(LOADING_DELAY);
      
      const response = await fetch("/data/runs.json");
      if (!response.ok) {
        throw new Error("Failed to fetch run details");
      }
      const data = await response.json();
      const runData = data.find((r: Run) => r.id === id);
      if (!runData) {
        throw new Error("Run not found");
      }
      setRun(runData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load run details. Please try again later.");
      setLoading(false);
    }
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    // Send message to iframe
    const iframe = document.getElementById(
      "babylonIframe"
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "changeColor", color }, "*");
    }
  };

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
  if (error) return <div>{error}</div>;
  if (!run) return <div>Run not found</div>;

  return (
    <div className="container mx-auto p-4 grid gap-6">
      <Link to="/" className="mb-4 flex items-center gap-1 group">
        <img
          src="../../public/left-arrow.svg"
          alt=""
          className="h-4 transform transition-transform group-hover:-translate-x-[0.2rem]"
        />
        Back
      </Link>

      <section className="details-table border rounded-lg shadow">
        <table className="min-w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Run Name
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {run.name}
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Run ID
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {run.id}
              </td>
            </tr>
            <tr>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Date
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {new Date(run.date).toLocaleDateString()}
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Duration
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {run.duration} minutes
              </td>
            </tr>
            <tr>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Status
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {run.status}
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px] bg-gray-100">
                Duration
              </td>
              <td className="px-2 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-800 border-r-[1px]">
                {run.description}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="mb-4 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => handleColorChange("green")}
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          Green
        </button>

        <button
          type="button"
          onClick={() => handleColorChange("yellow")}
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          Yellow
        </button>

        <button
          type="button"
          onClick={() => handleColorChange("red")}
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          Red
        </button>
      </div>
      <iframe
        id="babylonIframe"
        src="/babylon.html"
        width="100%"
        height="400px"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default DetailsPage;
