import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import "./RecommendedPlaces.css"
const RecommendedPlaces = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // ค่าเริ่มต้นแสดง 5 รายการต่อหน้า
  const [places, setPlaces] = useState([]); // State สำหรับเก็บข้อมูลสถานที่

    // ฟังก์ชันเช็คขนาดหน้าจอ
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 500) {
          setItemsPerPage(2); // ถ้าหน้าจอเล็กกว่า 350px ให้แสดง 2 รายการต่อหน้า
        } else {
          setItemsPerPage(5); // ถ้าหน้าจอใหญ่กว่า 350px ให้แสดง 5 รายการต่อหน้า
        }
      };
  
      handleResize(); // เช็คขนาดตอนโหลดหน้า
      window.addEventListener("resize", handleResize); // ฟังชันทำงานเมื่อเปลี่ยนขนาดหน้าจอ
  
      return () => {
        window.removeEventListener("resize", handleResize); // ลบ event listener ตอน component ถูก unmount
      };
    }, []);

   // ดึงข้อมูลจาก API
   useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:8000/travel_Destination'); // ใส่ URL ของ API 
        const data = await response.json();
        setPlaces(data); // เก็บข้อมูลสถานที่ใน state
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
  }, []);

  
  const totalPages = Math.ceil(places.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const paginatedPlaces = places.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 6) {
      // ถ้าจำนวนหน้าน้อยกว่าหรือเท่ากับ 6 แสดงทุกหน้า
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // ถ้าอยู่ใน 3 หน้าแรก
      if (currentPage <= 2) {
        pages.push(0, 1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1);
      } 
      // ถ้าอยู่ใน 3 หน้าสุดท้าย
      else if (currentPage >= totalPages - 3) {
        pages.push(0, 1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1);
      } 
      // ถ้าอยู่ตรงกลาง
      else {
        pages.push(0, 1, 2, '...', currentPage, '...', totalPages - 3, totalPages - 2, totalPages - 1);
      }
    }
    return pages;
  };
  
  
  // อัตโนมัติ 4 วินาที
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 4000); // Change slide every 5000 milliseconds (5 seconds)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [totalPages]);

  
  return (
    <div className="places-container">
      <h2 className="places-title">สถานที่ท่องเที่ยวแนะนำ</h2>
      <div className="places-button-wrapper">
        <button className="places-nav-button" onClick={handlePrev}>{"<"}</button>
        <div className="places-list" key={currentPage}>
          {paginatedPlaces.map((place) => (
            <div className="places-card" key={place.destination_en}>
              <div className="places-image-wrapper">
                {/* ใช้ imageURL จากฟิลด์ profile */}
                <img src={place.img?.url} alt={place.destination_en} />
              </div>
              <div className="places-details">
                <h3 className="places-name">{place.destination_en}</h3>
                <p className="places-location">{place.id_province}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="places-nav-button" onClick={handleNext}>{">"}</button>
      </div>
      <div className="places-pagination">
  {getVisiblePages().map((page, index) => (
    <React.Fragment key={index}>
      {page === '...' ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={`dot-${index}-${i}`}  className="places-page-indicator disabled"></div>
        ))
      ) : (
        <div
                className={`places-page-indicator ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              ></div>
      )}
    </React.Fragment>
  ))}
</div>


    </div>
  );
};

export default RecommendedPlaces;
