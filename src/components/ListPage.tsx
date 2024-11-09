import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Run } from "../types";

const ListPage  = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRuns();
  }, []);



  const fetchRuns = async () => {
    try {
      // In a real application, this would be an API call
      const response = await fetch("/data/runs.json");
      if (!response.ok) {
        throw new Error("Failed to fetch runs");
      }
      const data = await response.json();
      setRuns(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load runs. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
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
          {runs.map((run) => (
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
                {run.status == "Success" ? (
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Success
                  </span>
                ) : run.status == "Failed" ? (
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
    </section>
  );
}

export default ListPage