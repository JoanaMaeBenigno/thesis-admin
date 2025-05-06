export interface Choice {
  answer_text: string,
  id: string
}

export interface Question {
  id: string;
  question_text: string;
  correct_option: string;
  choices: Choice[];
}

export interface FlatQuestion {
  id: string;
  question_text: string;
  correct_option: string;
  choices: string;
}

export async function fetchQuestions(category_id: string): Promise<Question[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/check_learning/question/with_answer/${category_id}`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}

export async function postQuestion(payload: string) {
  console.log(payload)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/check_learning/question`,
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

export async function deleteQuestion(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/check_learning/question/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

