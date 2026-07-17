import React from 'react';

export default function Pagination({ currentPage, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pagination-bar">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages || 1}</span>
      <button
        className="page-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}