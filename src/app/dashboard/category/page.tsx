"use client"

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { Column } from "@/components/table";
import { Category, deleteCategory, fetchCategories } from "@/services/categoryService"; // adjust path as needed
import ConfirmDeleteModal from "@/components/confirmDeleteModal";

const columns: Column<Category>[] = [
  { header: "Name", accessor: "name" },
  { header: "Description", accessor: "description" },
  { header: "Pass Rate", accessor: "passRate" },
];

export default function CheckLearning() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    fetchCategories()
      .then(setData)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (category: Category) => {
    console.log("Edit:", category);
    // Add logic here
  };

  const confirmDelete = (id: string) => {
    setIdToDelete(id);
  };

  const handleDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteCategory(idToDelete);
      setData(prev => prev.filter(category => category.id !== idToDelete));
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  const handleAddNewCategory = () => {
    router.push('/dashboard/category/add')
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Category</h1>
      {/* Button at the top */}
      <div className="mb-4">
        <button
          onClick={handleAddNewCategory}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          Add Category
        </button>
      </div>
      <Table
        disablePagination={true}
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        rowsPerPage={5}
        renderActions={(row) => (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline">Edit</button>
            {/* <button onClick={() => handleDelete(row)} className="text-red-600 hover:underline">Delete</button> */}
            <button onClick={() => confirmDelete(row.id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />

      <ConfirmDeleteModal
        isOpen={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={() => handleDelete()}
      />
    </div>
  );
}
