import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import "./Gallery.css"
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
// จัดการปุ่มเปลี่ยนเซตข้อมูล
  const [startPage, setStartPage] = useState(1);
const maxVisiblePages = 7;

// State สำหรับ Modal
const [showModal, setShowModal] = useState(false);
const [modalGallery, setModalGallery] = useState([]);

const [selectedTitle, setSelectedTitle] = useState("");
const [selectedDate, setSelectedDate] = useState("");

const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
const thumbnailCount = 10; // จำนวน Thumbnails ที่จะแสดงพร้อมกัน

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:8000/travel_gallery");
        const data = await response.json();

        const formattedImages = data.map((item) => {
          const gallery = item.gallery_bottom || [];
          const formattedGallery = gallery.map((img) => img.imageURL || "https://via.placeholder.com/300?text=No+Image");
          const randomImage = formattedGallery.length > 0 ? formattedGallery[Math.floor(Math.random() * formattedGallery.length)] : "https://via.placeholder.com/300?text=No+Image";

          return {
            src: randomImage,
            title: item.tour_excursion_name || "ไม่ระบุชื่อทัวร์",
            date: item.price_info[0] 
              ? `${item.price_info[0].start_date} - ${item.price_info[0].end_date}` 
              : "ไม่ระบุช่วงเวลา",
              gallery: formattedGallery, // เก็บรูปทั้งหมดใน gallery_bottom
             name: gallery.map(img => img.name || "ไม่มีชื่อรูปภาพ"), // เก็บชื่อภาพจาก gallery_bottom
          };
        });

        setImages(formattedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const displayedImages = images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      if (currentPage === startPage + maxVisiblePages - 1) {
        setStartPage((prev) => prev + 1);
      }
    }
  };
  
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      if (currentPage === startPage) {
        setStartPage((prev) => prev - 1);
      }
    }
  };
  
  const visiblePages = Array.from(
    { length: Math.min(maxVisiblePages, totalPages - startPage + 1) },
    (_, i) => startPage + i
  );

  
  const openModal = (gallery, title, date) => {
    setModalGallery(gallery);
    setShowModal(true);
    setSelectedTitle(title); // เก็บ title ที่ถูกเลือก
    setSelectedDate(date); // เก็บ date ที่ถูกเลือก
  };
  

  const closeModal = () => {
    setShowModal(false);
    setModalGallery([]);
  };

  // ฟังก์ชันเปลี่ยนรูปใหญ่
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  

  // เลื่อนรูปอัตโนมัติทุก 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % modalGallery.length);
    }, 5000);

    return () => clearInterval(interval); // ล้าง Interval เมื่อโมดัลถูกปิด
  }, [modalGallery.length]);

  useEffect(() => {
    const groupIndex = Math.floor(currentImageIndex / thumbnailCount);
    setThumbnailStartIndex(groupIndex * thumbnailCount);
  }, [currentImageIndex]);

  const slideThumbnails = (direction) => {
    const maxIndex = modalGallery.length - 1;  // คำนวณ index สูงสุด
    if (direction === 'next') {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) > maxIndex ? 0 : prevIndex + 1); // เลื่อนถ้าไม่ถึงรูปสุดท้าย
    } else if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1) < 0 ? maxIndex : prevIndex - 1); // เลื่อนถ้าไม่ถึงรูปแรก
    }
  };
  
  
  return (
    <div className="gallery-container">
      <h2 className="gallery-title">แกลลอรี่</h2>
      <div className="gallery-image-row">
        {displayedImages.slice(0, 3).map((image, index) => (
            <div
              key={index} 
              className={`gallery-image-card ${index === 0 ? 'long' : 'square'}`} 
              onClick={() => openModal(image.gallery, image.title, image.date)} // ส่ง title และ date
            >
          <img src={image.src} alt={image.title} className="image"/>
          <div className={`gallery-image-overlay ${index === 0 ? 'long' : 'square'}`}></div> {/* หมอกขาว */}
            <div className="gallery-image-info">
            <p className="gallery-image-title">{image.title}</p>
            <p className="gallery-image-date">{image.date}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="gallery-image-row">
      {displayedImages.slice(3, 6).map((image, index) => (
          <div
          key={index + 3}
          className={`gallery-image-card ${index === 2 ? 'long' : 'square'}`}  // รูปที่ 6 (index = 2 ใน slice) จะเป็น long
          onClick={() => openModal(image.gallery, image.title, image.date)} // ส่ง title และ date
        >
           <img src={image.src} alt={image.title} className="image" />
           <div className={`gallery-image-overlay ${index === 2 ? 'long' : 'square'}`}></div> {/* หมอกขาว */}
           <div className="gallery-image-info">
              <p className="gallery-image-title">{image.title}</p>
              <p className="gallery-image-date">{image.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-pagination">
  <button onClick={handlePrev} disabled={startPage === 1}>
    {"<"}
  </button>
  {visiblePages.map((page) => (
    <div
      key={page}
      className={`gallery-dot ${currentPage === page ? 'active' : ''}`}
      onClick={() => handlePageClick(page)}
    />
  ))}
  <button
    onClick={handleNext}
    disabled={startPage + maxVisiblePages - 1 >= totalPages}
  >
    {">"}
  </button>
</div>

   {/* Modal */}
   { showModal && (
      <div className="gallery-modal-overlay" onClick={closeModal}>
        <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="gallery-modal-header">
            <h3>{selectedTitle}</h3>
            <p>{selectedDate}</p>
          </div>
          <div className="gallery-modal-body">
            {/* รูปใหญ่ */}
            <div className="gallery-main-image">
              <img
                  src={modalGallery[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="gallery-large-image"
              />
            </div>
            {/* Thumbnails */}
            <div className="gallery-thumbnails">
            <button className="gallery-slide-button" onClick={() => slideThumbnails('prev')}>
    <FiChevronLeft size={30} />
  </button>

              {modalGallery
                .slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailCount)
                .map((src, index) => (
                  <img
                    key={index + thumbnailStartIndex}
                    src={src}
                    alt={`Thumbnail ${index + thumbnailStartIndex + 1}`}
                    className={`gallery-thumbnail ${index + thumbnailStartIndex === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleImageChange(index + thumbnailStartIndex)}
                  />
                ))}
            <button className="gallery-slide-button" onClick={() => slideThumbnails('next')}>
    <FiChevronRight size={30} />
  </button>
            </div>
          </div>
          <button className="gallery-close-button"onClick={closeModal}>X</button>
        </div>
      </div>
)}


    </div>
  );
};


export default Gallery;


