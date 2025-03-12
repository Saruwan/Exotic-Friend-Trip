import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [currentSet, setCurrentSet] = useState(0);
  const [imageSets, setImageSets] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:8000/travel_Destination");
        const data = await response.json();

        // เรียงตาม id_destination
        const sortedData = data.sort((a, b) => a.id_destination - b.id_destination);

        // แบ่งข้อมูลเป็นกลุ่มละ 3 รูป
        const groupedImages = [];
        for (let i = 0; i < sortedData.length; i += 3) {
          groupedImages.push(sortedData.slice(i, i + 3).map(item => ({
            src: item.img?.url,   // URL ของรูปภาพ
            label: item.destination_en // ชื่อสถานที่
          })));
        }

        setImageSets(groupedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

    // เปลี่ยนสไลด์อัตโนมัติทุก 5 วินาที
    useEffect(() => {
      if (imageSets.length > 1) {
        const interval = setInterval(() => {
          setCurrentSet((prev) => (prev === imageSets.length - 1 ? 0 : prev + 1));
        }, 3000); // เปลี่ยนทุก 5 วินาที
  
        return () => clearInterval(interval); // ล้าง interval เมื่อ component unmount
      }
    }, [imageSets]);
    
  const handlePrev = () => {
    setCurrentSet((prev) => (prev === 0 ? imageSets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSet((prev) => (prev === imageSets.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="slider-wrapper">
      {imageSets.length > 0 ? (
        <>
          <div className="slider-content">
            {imageSets[currentSet].map((image, index) => (
              <div className="slider-image-box" key={index}>
                <img src={image.src} alt={image.label} />
                <div className="slider-label">{image.label}</div>
              </div>
            ))}
          </div>

          <div className="slider-control-section">
            <div className="slider-circle-button" onClick={handlePrev}>{"<"}</div>
            <div className="slider-circle-button" onClick={handleNext}>{">"}</div>
            <div className="slider-separator" />
            <div className="slider-page-number">
              {String(currentSet + 1).padStart(2, "0")}
            </div>
          </div>
        </>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default ImageSlider;
