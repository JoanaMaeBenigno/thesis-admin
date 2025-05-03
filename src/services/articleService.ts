export type Articles = {
  pagination: Pagination;
  posts: Article[]
}

type Pagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export type Article = {
  title: string
  subtitle: string
  thumbnail_image: string
  uuid: string
}

export async function fetchArticles(page = 1, pageSize = 20): Promise<Articles> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${API_URL}/article?page=${page}&page_size=${pageSize}`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const json = await res.json()

  return json.data || []
}
