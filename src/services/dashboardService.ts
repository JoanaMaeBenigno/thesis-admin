export interface DashboardCheckLearning {
  average_score: number;
  passing_rate: number;
  total_exam_taken: number;
  total_passed_exam: number;
}

export async function fetchDashboardCheckLearning(): Promise<DashboardCheckLearning> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/dashboard/check_learning`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || {}
}
