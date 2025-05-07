export interface Survey {
  id: string;
  question_text: string;
}

export async function fetchSurveyQuestions(category_id: string): Promise<Survey[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/check_learning/survey/${category_id}`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}

export async function postSurveyQuestion(payload: string) {
  console.log(payload)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/check_learning/survey`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    }
  )
  console.log(res)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

export async function deleteSurveyQuestion(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/check_learning/survey/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

