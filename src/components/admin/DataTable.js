import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export const DataTable = ({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  searchable = false,
  pagination = true,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = searchable && searchTerm
    ? data.filter(item =>
        columns.some(column => 
          String(item[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {searchable && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sm:px-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr 
                  key={row[keyField]} 
                  className={`${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={`${row[keyField]}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronUpIcon className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDownIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
