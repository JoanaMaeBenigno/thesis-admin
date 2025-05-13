export interface File {
  created_date: string
  description: string
  file_url: string
  id: string
  title: string
}

// Worksheet
export async function fetchWorksheets(): Promise<File[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/file/worksheet`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}

export async function postWorksheet(payload: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/file/worksheet`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    }
  )

  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

// Lessons
export async function fetchLessons(): Promise<File[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/file/lesson`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}

export async function postLesson(payload: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/file/lesson`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    }
  )

  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

// Videos
export async function fetchVideos(): Promise<File[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/file/video`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}

export async function postVideo(payload: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/file/video`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    }
  )

  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}

// Common
export async function deleteFile(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/file/common/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
}
