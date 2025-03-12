import React, { useState, useEffect } from 'react';
import "./AdBanner.css"
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    'https://ttotravel.com/wp-content/uploads/2020/07/facebook-cover-tto.jpg',
    'https://www.agilenttours.com/assets/img/ads1-1.png',
    'https://www.businesseventsthailand.com/uploads/event_calendar/web/230301-banner-ZZMzQxicU.jpg',
    'https://imaginetourservice.com/images/bannerbest.jpg?=v1',
    'https://itravels.s3.amazonaws.com/uploads/programs/KXJ101/banner-KXJ101_260422-163047.jpg',
  ];

  const handleDotClick = (index) => {
    setCurrentSlide(index); // เมื่อคลิกปุ่มวงกลม จะเปลี่ยนภาพที่ตรงกับปุ่ม
  };

  // สไลด์ 3 วินาที
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 3000); // Change slide every 5000 milliseconds (5 seconds)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [images.length]); // Depend on the images array length to reset the interval

  return (
    <div className="ad-banner-container">
      <div className="ad-banner-slide">
        <img src={images[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="ad-image" />
     
      <div className="ad-pagination-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`ad-dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
    </div>
  );
};


export default Banner;
