"use client"

import { DashboardCheckLearning, fetchDashboardCheckLearning } from "@/services/dashboardService";
import { SetStateAction, useEffect, useState } from "react";

export default function Dashboard() {
  // const [checkLearning, setCheckLearning] = useState<DashboardCheckLearning>
  const [checkLearning, setCheckLearning] = useState<DashboardCheckLearning>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardCheckLearning()
      .then(setCheckLearning)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-xl mb-6">Check Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Exam Taken</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{checkLearning?.total_exam_taken}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Passed Exam</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{checkLearning?.total_passed_exam}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800">Passing Rate</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{checkLearning?.passing_rate}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800">Average Score</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{checkLearning?.average_score}</p>
        </div>
      </div>
    </div>
  );
}
