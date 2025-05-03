"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles, Article } from '@/services/articleService'; // Adjust the import path
import AddArticleModal from '@/components/addArticleModal'; // Import the AddArticleModal component

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = (uuid: string) => {
    if (confirm('Delete this article?')) {
      fetch(`/api/admin/articles/${uuid}`, { method: 'DELETE' })
        .then(() => setArticles(articles.filter(article => article.uuid !== uuid)))
        .catch(() => alert('Failed to delete'));
    }
  };

  const handlePrev = () => {
    if (pagination && page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (pagination && page < pagination.total_pages) setPage(page + 1);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSaveArticle = (title: string, subtitle: string, thumbnail: string) => {
    // Here, you'd typically make an API call to save the article to the backend
    const newArticle = {
      uuid: Date.now().toString(),
      title,
      subtitle,
      thumbnail_image: thumbnail
    };
    setArticles([newArticle, ...articles]);
  };

  if (loading) return <p>Loading articles...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Articles</h1>

      <button
        onClick={toggleModal}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Article
      </button>

      {/* Add Article Modal */}
      <AddArticleModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSave={handleSaveArticle}
      />

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
              <Link
                href={`/dashboard/articles/${article.uuid}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(article.uuid)}
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
    </div>
  );
}
