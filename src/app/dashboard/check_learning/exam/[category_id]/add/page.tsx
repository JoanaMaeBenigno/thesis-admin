"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category, fetchCategory } from "@/services/categoryService";
import { postQuestion } from "@/services/questionService";

export default function AddCheckLearningExamPage() {
  const { category_id } = useParams<{ category_id: string }>();

  const [category, setCategory] = useState<Category>();

  const [question, setQuestion] = useState('');
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [choice3, setChoice3] = useState('');
  const [choice4, setChoice4] = useState('');
  const [correctOption, setCorrectOption] = useState('choice-a');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCategory(category_id)
      .then(setCategory)
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        category_id: category_id,
        question_text: question,
        correct_option: correctOption,
        choices: [
          {'id': 'choice-a', 'answer_text': choice1},
          {'id': 'choice-b', 'answer_text': choice2},
          {'id': 'choice-c', 'answer_text': choice3},
          {'id': 'choice-d', 'answer_text': choice4}
        ]
      };

      await postQuestion(JSON.stringify(payload));

      setModalMessage("Question saved successfully!");
      setModalSuccess(true);
      setModalOpen(true);
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error(err);
      setModalMessage("Failed to save question.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Check Learning - Exam - {category?.name}</h1>
      <section>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 w-full"
        >
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Choice 1</label>
            <input
              type="text"
              value={choice1}
              onChange={e => setChoice1(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Choice 2</label>
            <input
              type="text"
              value={choice2}
              onChange={e => setChoice2(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Choice 3</label>
            <input
              type="text"
              value={choice3}
              onChange={e => setChoice3(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Choice 4</label>
            <input
              type="text"
              value={choice4}
              onChange={e => setChoice4(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
            <select
              value={correctOption}
              onChange={e => setCorrectOption(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="choice-a">Choice A</option>
              <option value="choice-b">Choice B</option>
              <option value="choice-c">Choice C</option>
              <option value="choice-d">Choice D</option>
            </select>
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
                if (modalSuccess) router.push(`/dashboard/check_learning/exam/${category_id}`);
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
