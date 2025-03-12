import React from 'react';
import './Pagination.css';
const Pagination = ({ totalPages, currentPage, handlePageClick }) => {
  const maxVisiblePages = 3; // จำนวนหน้าที่แสดงก่อนและหลัง "...".

  const getVisiblePages = () => {
    const pages = [];
  
    if (totalPages <= 5) {
      // ถ้าจำนวนหน้าน้อยกว่าหรือเท่ากับ 5 แสดงทุกหน้า
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // เมื่ออยู่ใน 3 หน้าต้น
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // เมื่ออยู่ใน 3 หน้าสุดท้าย
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // เมื่ออยู่กลาง
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
  
    return pages;
  };
  
  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-container-promotion">
      {/* ปุ่มเลื่อนไปซ้าย */}
      <button
        onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
        className="pagination-button"
      >
          <div className="pagination-arrow pagination-arrow-left"></div>
      </button>

      {/* แสดงตัวเลขหน้า */}
      <div className="pagination-pages">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (page === '...') {
                // เมื่อกด "...":
                if (index === 1) {
                  // กด "..." ฝั่งซ้าย
                  handlePageClick(Math.max(1, currentPage - 1));
                } else if (index === visiblePages.length - 2) {
                  // กด "..." ฝั่งขวา
                  handlePageClick(Math.min(totalPages, currentPage + 1));
                }
              } else {
                handlePageClick(page);
              }
            }}
            className={`pagination-page-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* ปุ่มเลื่อนไปขวา */}
      <button
        onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
        className="pagination-button"
      >
          <div className="pagination-arrow pagination-arrow-right"></div>
      </button>
    </div>
  );
};

export default Pagination;
