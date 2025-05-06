"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postCategory } from "@/services/categoryService";

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        description
      };

      await postCategory(JSON.stringify(payload));

      setModalMessage("Category saved successfully!");
      setModalSuccess(true);
      setModalOpen(true);
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error(err);
      setModalMessage("Failed to save category.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Check Learning - Category</h1>
      <section>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 w-full"
        >
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard/check_learning")}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Category"}
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
                if (modalSuccess) router.push("/dashboard/category");
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
