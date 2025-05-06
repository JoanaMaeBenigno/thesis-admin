import { useState } from "react";
import Pagination from "@/components/pagination";

export interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
  getRowKey?: (row: T) => string | number;
  disablePagination?: boolean;
  renderActions?: (row: T) => React.ReactNode;
}

export default function Table<T extends object>({
  columns,
  data,
  rowsPerPage = 10,
  disablePagination = false,
  getRowKey,
  renderActions
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = disablePagination
    ? data
    : data.slice(startIdx, startIdx + rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="w-full p-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginatedData.map((row) => (
            <tr key={getRowKey ? getRowKey(row) : JSON.stringify(row)}>
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-4 py-2 text-sm text-gray-700">
                  {String(row[col.accessor])}
                </td>
              ))}
              {renderActions && (
                <td className="px-4 py-2 text-sm text-gray-700">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!disablePagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
