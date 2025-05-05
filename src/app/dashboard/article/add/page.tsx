"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postArticle } from "@/services/articleService";

export default function ArticlesPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [contentBlocks, setContentBlocks] = useState([{ type: 'paragraph', content: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const router = useRouter();

  const handleAddBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'paragraph', content: '' }]);
  };

  const handleDeleteBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleContentChange = (index: number, value: string) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].content = value;
    setContentBlocks(newBlocks);
  };

  const handleTypeChange = (index: number, newType: string) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index].type = newType;
    setContentBlocks(updatedBlocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        subtitle,
        author,
        thumbnail,
        content: contentBlocks,
      };

      await postArticle(JSON.stringify(payload));

      setModalMessage("Article saved successfully!");
      setModalSuccess(true);
      setModalOpen(true);
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error(err);
      setModalMessage("Failed to save article.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Articles</h1>
      <section>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 w-full"
        >
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {thumbnail && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Image Preview</p>
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="w-full max-h-64 object-cover rounded"
              />
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Content</h2>
            {contentBlocks.map((block, index) => (
              <div
                key={index}
                className="relative border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={block.type}
                      onChange={e => handleTypeChange(index, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="image_url">Image URL</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(index)}
                    className="ml-4 mt-6 h-10 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {block.type === "paragraph" ? "Content" : "Image URL"}
                  </label>
                  <textarea
                    value={block.content}
                    onChange={e => handleContentChange(index, e.target.value)}
                    placeholder={block.type === "paragraph" ? "Enter paragraph content..." : "Enter image URL..."}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBlock}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Paragraph
            </button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard/article")}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Article"}
            </button>
          </div>
        </form>
      </section>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center space-y-4">
            <h2 className={`text-xl font-semibold ${modalSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {modalSuccess ? 'Success' : 'Error'}
            </h2>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                if (modalSuccess) router.push("/dashboard/article");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
