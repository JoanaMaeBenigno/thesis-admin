"use client"

import { SetStateAction, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Table, { Column } from "@/components/table";
import { Category, fetchCategory } from "@/services/categoryService"; // adjust path as needed
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import { deleteQuestion, fetchQuestions, FlatQuestion, Question } from "@/services/questionService";

const columns: Column<FlatQuestion>[] = [
  { header: "Question", accessor: "question_text" },
  { header: "Choices", accessor: "choices" },
  { header: "Answer", accessor: "correct_option" },
];

export default function CheckLearningExamPage() {
  const { category_id } = useParams<{ category_id: string }>();

  const [category, setCategory] = useState<Category>();
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    fetchCategory(category_id)
      .then(setCategory)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message));

    fetchQuestions(category_id)
      .then(setData)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (question: FlatQuestion) => {
    console.log("Edit:", question);
    // Add logic here
  };

  const confirmDelete = (id: string) => {
    setIdToDelete(id);
  };

  const handleDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteQuestion(idToDelete);
      setData(prev => prev.filter(question => question.id !== idToDelete));
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  const transformQuestions = (data: Question[]): FlatQuestion[] => {
    return data.map(q => ({
      id: q.id,
      choices: q.choices.map(c => c.answer_text).join(", "),
      correct_option: q.choices.find(c => c.id === q.correct_option)?.answer_text || "",
      question_text: q.question_text
    }));
  };

  const handleAddNewQuestion = () => {
    router.push(`/dashboard/check_learning/exam/${category?.id}/add`)
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Check Learning - Exam - {category?.name}</h1>
      {/* Button at the top */}
      <div className="mb-4">
        <button
          onClick={handleAddNewQuestion}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          Add Question
        </button>
      </div>
      <Table
        disablePagination={true}
        columns={columns}
        data={transformQuestions(data)}
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
