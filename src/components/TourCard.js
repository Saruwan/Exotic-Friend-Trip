import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTag,
  faClock,
  faCalendar,
  faCoins,
  faPhone,
  faShareAlt,
  faChevronLeft, 
  faChevronRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FaMapMarked, FaPhone, FaWhatsapp, } from "react-icons/fa";
import "./TourCard.css"
import { useNavigate } from 'react-router-dom';

import Promotion from "./Promotions"
import { useParams } from "react-router-dom";
import TourCardProgram from "./TourCardProgram"; 
import TourCardDetails from "./TourCardDetails"; 
import { useLocation } from 'react-router-dom';
const TourCard = () => {
  const [currentImage, setCurrentImage] = useState(0);
   const [isLiked, setIsLiked] = useState(false);
 
   const [activeTab, setActiveTab] = useState("overview"); // Default tab is "overview"
 
   const [selectedDateRange, setSelectedDateRange] = useState({ start: "", end: "" });
   const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [adultPrice, setAdultPrice] = useState(0);
  const [childPrice, setChildPrice] = useState(0);
  const [selectedPriceId, setSelectedPriceId] = useState(0); // ราคาเริ่มต้น

  const { id } = useParams(); // รับ id จาก URL
  const [tourInfo, setTourInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBooking = () => {
    // ดึงข้อมูลวันที่และราคาทั้งหมดจาก schedule
    const travelDates = tourInfo.schedule.map(schedule => {
      const roomPrices = {
        adult: schedule.adult_price,  // ค่าห้องสำหรับผู้ใหญ่
        childWithBed: schedule.child_price,  // ค่าห้องสำหรับเด็กที่มีเตียง
        childWithoutBed: 0,  // ค่าห้องสำหรับเด็กที่ไม่มีเตียง
      };

      return {
        price_id: schedule.price_id,
        start_date: schedule.start_date || "N/A",
        end_date: schedule.end_date || "N/A",
        roomPrices: roomPrices,
      };
    });

    const selectedPriceDetails = tourInfo.schedule.find(schedule => schedule.price_id === selectedPriceId);

    // คำนวณราคาทั้งหมดสำหรับแต่ละประเภท
    const adultTotal = adultCount * adultPrice;
    const childTotal = childCount * childPrice;
    const infantTotal = infantCount * 0; // ทารกไม่คิดราคา
  
    // รวมราคาทั้งหมด
    const newTotal = adultTotal + childTotal + infantTotal;


    // เตรียมข้อมูลที่จะส่งไปยังหน้า booking
    const bookingData = {
      id_tour: id,  // ไอดีของทัวร์
      selected_price_id: selectedPriceId,  // ไอดีของราคา
      selected_price_details: selectedPriceDetails ? {
        price_id: selectedPriceDetails.price_id,
        start_date: selectedPriceDetails.start_date || "N/A",
        end_date: selectedPriceDetails.end_date || "N/A",
        roomPrices: {
          adult: selectedPriceDetails.adult_price,
          childWithBed: selectedPriceDetails.child_price,
        }
      } : {},
      all_travel_dates: travelDates,  // ข้อมูลทั้งหมดของวันที่และราคา
      adult_count: adultCount, // จำนวนผู้ใหญ่
      child_count: childCount, // จำนวนเด็ก
      infant_count: infantCount, // จำนวนทารก
      price_details: {
        adult: {
          count: adultCount,
          price_per_person: adultPrice,
          total: adultTotal,
        },
        child: {
          count: childCount,
          price_per_person: childPrice,
          total: childTotal,
        },
        infant: {
          count: infantCount,
          price_per_person: 0,
          total: infantTotal,
        },
      },
      total_price: newTotal, // ราคารวม
      seat: tourInfo.seat, 
    };

    console.log("Booking Data:", bookingData);

    // ส่งข้อมูลไปยังหน้า booking
    navigate(`/TourBooking/${id}`, { state: bookingData });
};
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % tourInfo.thumbnails.length);
  }, 3000); // ทุก 3 วินาที

  // เมื่อ component ถูกทำลาย (unmount) ให้หยุดการเลื่อน
  return () => clearInterval(interval);
}, [tourInfo]);

   
   useEffect(() => {
     const fetchTourInfo = async () => {
       try {
         const response = await fetch(`http://localhost:8000/travel_api?id=${id}`);
         const data = await response.json();
 
         // กรองข้อมูลตาม id
         const tour = data.find((item) => item.idWebsite_TravelCenterDatabase === id);
 
         if (tour) {
           console.log("Itinerary:", tour.Itinerary);
           console.log("Plan:", tour.Itinerary?.[0]?.plan);
           
           // แปลงข้อมูลให้ตรงกับโครงสร้างที่ต้องการ
           const formattedTour = {
             id: tour.idWebsite_TravelCenterDatabase,
             title: tour.tour_excursion_name,
             province: tour.id_province,
             code: tour.idWebsite_TravelCenterDatabase,
             duration: tour.excursion_type,
             schedule: tour.price_info.map((schedule, index) => ({
              ...schedule,
              price_id: schedule.price_id ?? index,
              period: `${schedule.start_date} - ${schedule.end_date}`,
              roomPrices: {
                adultSingle: schedule.adult_price,
                childWithBed: schedule.child_price,
              },
            })),
             seat: tour.seats,
             price: tour.price_info?.[0]?.adult_price 
             ? `${tour.price_info[0].adult_price} บาท/ท่าน` 
             : "ยังไม่มีรายการทัวร์",
           
   
             thumbnails: (tour.gallery_bottom || []).map((img) => img.imageURL || "https://via.placeholder.com/150"),
           };
 
           setTourInfo(formattedTour);
  // Set default date and prices based on the first price_id (0)
  const defaultPriceInfo = formattedTour.schedule[0];
  setSelectedDateRange({ start: defaultPriceInfo.start_date, end: defaultPriceInfo.end_date });
  setAdultPrice(defaultPriceInfo.roomPrices.adultSingle);
  setChildPrice(defaultPriceInfo.roomPrices.childWithBed);
  setSelectedPriceId(defaultPriceInfo.price_id);
} else {
  console.error("No data found for this ID.");
}
} catch (error) {
console.error("Error fetching data:", error);
} finally {
setLoading(false);
}
};

fetchTourInfo();
}, [id]);

useEffect(() => {
  if (tourInfo && tourInfo.schedule) {
    const adultTotal = adultCount * adultPrice;
    const childTotal = childCount * childPrice;
    const infantTotal = infantCount * 0; // ทารกไม่คิดราคา
    const newTotal = adultTotal + childTotal + infantTotal;

    setTotalPrice(newTotal);
  }
}, [adultCount, childCount, infantCount, adultPrice, childPrice, tourInfo]);

const handleIncrement = (type) => {
  if (type === "adult") {
    // ตรวจสอบว่าจำนวนผู้ใหญ่ไม่เกินจำนวนที่นั่ง
    if (adultCount < tourInfo.seat) {
      setAdultCount(adultCount + 1);
    }
  }
  if (type === "child") setChildCount(childCount + 1);
  if (type === "infant") setInfantCount(infantCount + 1);
};

const handleDecrement = (type) => {
  if (type === "adult" && adultCount > 1) setAdultCount(adultCount - 1);
  if (type === "child" && childCount > 0) setChildCount(childCount - 1);
  if (type === "infant" && infantCount > 0) setInfantCount(infantCount - 1);
};

const handleDateChange = (selectedPriceId) => {
  if (tourInfo && tourInfo.schedule) {
    // ค้นหาข้อมูลราคาและวันที่ที่เลือก
    const selectedSchedule = tourInfo.schedule.find(schedule => schedule.price_id === selectedPriceId);
    if (selectedSchedule) {
      // อัปเดตราคาใหม่จากราคาที่เลือก
      setAdultPrice(selectedSchedule.roomPrices.adultSingle);
      setChildPrice(selectedSchedule.roomPrices.childWithBed);
      setSelectedPriceId(selectedPriceId);
    }
  }
};


   if (loading) {
     return <p>Loading...</p>;
   }
 
   if (!tourInfo) {
     return <p>No data available for ID: {id}</p>;
   }
   if (!tourInfo.Itinerary || !tourInfo.Itinerary[0]?.plan) {
     console.error("Itinerary หรือ Plan ไม่มีข้อมูลสำหรับ ID นี้");
   }

 
const handleMainImageClick = (direction) => {
  setCurrentImage((prev) =>
    direction === "next"
      ? (prev - 1) % tourInfo.thumbnails.length
      : (prev + 1 + tourInfo.thumbnails.length) % tourInfo.thumbnails.length
  );
};
 
const handleLike = () => setIsLiked(!isLiked);



return (
  <div className="tour-container">
    {/* Header */}
    <div className="tour-header">
      <h1 className="tour-title">{tourInfo.title}</h1>
      <p className="tour-province"> <FaMapMarked className="tour-icons" />{tourInfo.province}</p>
    </div>

    <div className="tour-divider" />

        {/* Left Section */}
        <div className="tour-image">
          <img
            src={tourInfo.thumbnails[currentImage]}
            alt="Main"
            className="tour-main-image"
            onClick={() => handleMainImageClick("next")} // คลิกเพื่อเลื่อนไปภาพถัดไป
            onContextMenu={(e) => {
              e.preventDefault();
              handleMainImageClick("prev"); // คลิกขวาเพื่อเลื่อนกลับภาพก่อนหน้า
            }}
          />
          <div className="tour-thumbnail-container">
             {/* ปุ่มเลื่อนซ้าย */}
             <button
              className="tour-left-arrow-button"
              onClick={() =>
                setCurrentImage((prev) => (prev - 1 + tourInfo.thumbnails.length) % tourInfo.thumbnails.length)
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="tour-thumbnails">
              {tourInfo.thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className={`tour-thumbnail ${currentImage === index ? "tour-active-thumbnail" : ""}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>

            {/* ปุ่มเลื่อนขวา */}
            <button
              className="tour-right-arrow-button"
              onClick={() =>
                setCurrentImage((prev) => (prev + 1) % tourInfo.thumbnails.length)
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

    
     {/* Content */}
     <div className="tour-content">
  {/* Left Section */}
  <div className="tour-left-section">
          <div className="tour-tabs">
            <div
              className={`tour-tab ${activeTab === "overview" ? "tour-active-tab" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              ภาพรวม
            </div>
            <div
              className={`tour-tab ${activeTab === "details" ? "tour-active-tab" : ""}`}
              onClick={() => setActiveTab("details")}
            >
             โปรแกรมทัวร์
            </div>
           
          </div>
          <div className="tour-separator" />
          {activeTab === "overview" && <TourCardDetails />}
          {activeTab === "details" && <TourCardProgram />}
          
        </div>

        
{/* Right Section */}
<div className="tour-right-section">
  {/* กรอบที่ 1: โปรแกรมทัวร์ */}
  <div className="tour-box">
    <h3 className="tour-box-title">โปรแกรมทัวร์</h3>
    <div className="tour-underline" />
    <div className="tour-box-content">
  <div className="tour-info-row">
    <strong className="tour-info-label">รหัสทัวร์</strong>
    <span className="tour-info-value">{tourInfo.id}</span>
  </div>
  <div className="tour-info-row">
    <strong className="tour-info-label">ระยะเวลา</strong>
    <span className="tour-info-value">{tourInfo.duration}</span>
  </div>
  <div className="tour-info-row">
    <strong className="tour-info-label">บรรจุ</strong>
    <span className="tour-info-value">{tourInfo.seat} ท่าน</span>
  </div>
</div>

  </div>

 {/* กรอบที่ 2: เลือกวันเดินทางและจำนวนคน */}
<div className="tour-box">
  {/* กรอบเลือกวันเดินทาง */}
  <div className="tour-date-box">
  <p className="tour-date-label">เลือกวันเดินทาง</p>
  <select
         className="tour-date-dropdown"
          value={selectedPriceId}
          onChange={(e) => handleDateChange(Number(e.target.value))}
        >
            {tourInfo.schedule.map((schedule) => (
          <option key={schedule.price_id} value={schedule.price_id}>
            {schedule.start_date} - {schedule.end_date}
          </option>
          ))}
        </select>
  </div>

  {/* กล่องผู้ใหญ่ */}
  <div className="tour-person-box">
    <div className="tour-person-info">
      <p><strong>ผู้ใหญ่</strong> <span className="tour-sub-text">Over 18+</span></p>
      <p className="tour-price">฿{adultPrice.toLocaleString()}</p>
    </div>
    <div className="tour-counter">
      <button className="tour-counter-button" onClick={() => handleDecrement("adult")}>-</button>
      <span className="tour-counter-value">{adultCount}</span>
      <button className="tour-counter-button"  onClick={() => handleIncrement("adult")}>+</button>
    </div>
  </div>

  {/* กล่องเด็ก */}
  <div className="tour-person-box">
    <div className="tour-person-info">
      <p><strong>เด็ก</strong> <span className="tour-sub-text">Under 12</span></p>
      <p className="tour-price">฿{childPrice.toLocaleString()}</p>
    </div>
    <div className="tour-counter">
    <button className="tour-counter-button" onClick={() => handleDecrement("child")}>-</button>
    <span className="tour-counter-value">{childCount}</span>
          <button className="tour-counter-button" onClick={() => handleIncrement("child")}>+</button>
    </div>
  </div>

  {/* กล่องทารก */}
  <div className="tour-person-box">
    <div className="tour-person-info">
      <p><strong>ทารก</strong> <span className="tour-sub-text">Under 3</span></p>
      <p className="tour-price">฿0</p>
    </div>
    <div className="tour-counter">
    <button className="tour-counter-button" onClick={() => handleDecrement("infant")}>-</button>
    <span className="tour-counter-value">{infantCount}</span>
          <button className="tour-counter-button" onClick={() => handleIncrement("infant")}>+</button>
    </div>
  </div>

  <div className="tour-underline" />

  {/* ราคารวม */}
<div className="tour-total-box">
  <div className="tour-total-container">
    <p className="tour-total-label"><strong>รวมทั้งหมด</strong></p>
    <p className="tour-total-price"><strong>฿{totalPrice.toLocaleString()}</strong></p>
  </div>
  <p className="tour-note">*VAT 7% Not Included</p>
  <button className="tour-book-button" onClick={() => handleBooking(tourInfo.id)}>จองเลย</button>
</div>


</div>


  {/* กรอบที่ 3: ช่องทางการติดต่อ */}
  <div className="tour-box">
    <h3 className="tour-box-title">ช่องทางการติดต่อ</h3>
    <div className="tour-underline" />
    <div className="tour-contact-info">
      <div className="tour-contact-item">
        <div className="tour-icon-circle">
        <FaPhone className="tour-icon" />
        </div>
        <span>0821522212</span>
      </div>
      <div className="tour-contact-item">
        <div className="tour-icon-circle"> 
        <FaWhatsapp className="tour-icon" />
        </div>
        <span>@TRIPONTOUR</span>
      </div>
      <div className="tour-qr-code">
        <img src="/qr-line.png" alt="QR Code" className="tour-qr-image" />
      </div>
    </div>
  </div>
</div>

        </div>
        
        <div className="tour-separator" />
    </div>
  );
};

export default TourCard;


