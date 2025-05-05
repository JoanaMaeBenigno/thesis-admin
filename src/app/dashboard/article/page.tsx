"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { fetchArticles, Article, deleteArticle } from '@/services/articleService'; // Adjust the import path
import ConfirmDeleteModal from '@/components/confirmDeleteModal';

type Pagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [uuidToDelete, setUuidToDelete] = useState<string | null>(null);
  const router = useRouter()

  const loadArticles = async (pageNum: number) => {
    try {
      const articlesData = await fetchArticles(pageNum);
      setArticles(articlesData.posts);
      setPagination({
        page: articlesData.pagination.page,
        page_size: articlesData.pagination.page_size,
        total_items: articlesData.pagination.total_items,
        total_pages: articlesData.pagination.total_pages
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load articles', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(page);
  }, [page]);

  const handlePrev = () => {
    if (pagination && page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (pagination && page < pagination.total_pages) setPage(page + 1);
  };

  const handleAddArticle = () => {
    router.push('/dashboard/article/add')
  }

  const handleEditArticle = (id) => {
    alert('Feature is still not available');
    // router.push('/dashboard/article/add')
  }

  const confirmDelete = (uuid: string) => {
    setUuidToDelete(uuid);
  };

  const handleDelete = async () => {
    if (!uuidToDelete) return;

    try {
      await deleteArticle(uuidToDelete);
      setArticles(prev => prev.filter(article => article.uuid !== uuidToDelete));
      setUuidToDelete(null);
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  if (loading) return <p>Loading articles...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Articles</h1>

      <button
        onClick={handleAddArticle}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Article
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.uuid} className="bg-white rounded shadow p-4">
            <img
              src={article.thumbnail_image}
              alt={article.title}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{article.subtitle}</p>
            <div className="flex gap-2">
              {/* <Link
                href={`/dashboard/articles/${article.uuid}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </Link> */}
              <button
                onClick={() => handleEditArticle(article.uuid)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => confirmDelete(article.uuid)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === pagination.total_pages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!uuidToDelete}
        onClose={() => setUuidToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
