import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // if (!totalPages || totalPages <= 1) return null; // No mostrar paginación si solo hay una página

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // Generar un array de páginas
  // for (let i = 1; i <= totalPages; i++) {
  //   pages.push(i);
  // }

  return (
    <div>
      <button
        className="btn btn-primary me-2"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`btn me-2 ${
            page === currentPage ? "btn-secondary" : "btn-light"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* <span>
        Page {currentPage} of {totalPages}
      </span> */}
      <button
        className="btn btn-primary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
