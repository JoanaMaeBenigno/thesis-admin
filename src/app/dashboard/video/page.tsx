"use client"

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { Column } from "@/components/table";
import { deleteFile, fetchVideos, File } from "@/services/file";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";

const columns: Column<File>[] = [
  { header: "Video URL", accessor: "file_url" }
];

export default function VideoPage() {
  const [data, setData] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    fetchVideos()
      .then(setData)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (file: File) => {
    console.log("Edit:", file);
    // Add logic here
  };

  const confirmDelete = (id: string) => {
    setIdToDelete(id);
  };

  const handleDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteFile(idToDelete);
      setData(prev => prev.filter(video => video.id !== idToDelete));
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  const handleAddNewVideo = () => {
    router.push('/dashboard/video/add')
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Videos</h1>
      {/* Button at the top */}
      <div className="mb-4">
        <button
          onClick={handleAddNewVideo}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          Add Video
        </button>
      </div>
      <Table
        disablePagination={true}
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        rowsPerPage={5}
        renderActions={(row) => (
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit(row)}
              className="px-2 py-0.5 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => confirmDelete(row.id)}
              className="px-2 py-0.5 text-xs text-white bg-red-500 hover:bg-red-600 rounded"
            >
              Delete
            </button>
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
