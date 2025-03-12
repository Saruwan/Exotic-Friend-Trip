import React, { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaTag} from "react-icons/fa"; // เพิ่ม FontAwesome Icons
import Pagination from './pagination_promotion'; // หรือเส้นทางที่ตรงกับไฟล์ Pagination.js
import { useNavigate } from "react-router-dom";
import "./Promotions.css"
const Promotions = () => {
  const promotionsRef = useRef(null);
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [promotionsPerPage, setPromotionsPerPage] = useState(4); // ค่าเริ่มต้นแสดง 4 รายการต่อหน้า
  
  const navigate = useNavigate();

  const handleDetailClick = (id) => {
    // นำทางไปยังหน้า TourCard และส่งค่า id ผ่าน URL parameter
    navigate(`/TourCard/${id}`);
  };

    // ฟังก์ชันเช็คขนาดหน้าจอและตั้งค่า promotionsPerPage
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 500) {
          setPromotionsPerPage(1); // หน้าจอขนาดเล็กกว่า 500px
        } else if (window.innerWidth <= 1000) {
          setPromotionsPerPage(2); // หน้าจอขนาด 1000px
        } else if (window.innerWidth <= 1300) {
          setPromotionsPerPage(3); // หน้าจอขนาด 1300px
        } else {
          setPromotionsPerPage(4); // หน้าจอขนาดปกติ
        }
      };
  
      handleResize(); // เช็คขนาดตอนโหลดหน้า
      window.addEventListener("resize", handleResize); // ฟังก์ชันทำงานเมื่อเปลี่ยนขนาดหน้าจอ
  
      return () => {
        window.removeEventListener("resize", handleResize); // ลบ event listener ตอน component ถูก unmount
      };
    }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("http://localhost:8000/travel_api");
        const data = await response.json();
        
        const formattedData = data.map((item) => {
           // ดึงข้อมูลทั้งหมดจาก price_info ที่มี id >= 0
          const departure = item.price_info.filter((info) => info.id >= 0);  // ใช้ filter เพื่อดึงออกทั้งหมดที่ id >= 0

          const idSuffix = item.idWebsite_TravelCenterDatabase.slice(-5); // ดึงแค่ 5 ตัวสุดท้ายจากเลข
  
          return {
            id: item.idWebsite_TravelCenterDatabase,
            name: item.tour_excursion_name,
            price: item.price_info?.[0]?.adult_price
            ? `${parseInt(item.price_info[0].adult_price).toLocaleString()}`
            : " - ",
          
     
            duration: item.excursion_type,
             details: item.description,
            image: item.profile ?.imageURL,
            departure: departure,  // เก็บข้อมูล departure ทั้งหมด
            code: idSuffix, // ดึงแค่ 5 ตัวสุดท้ายจากเลข
              license: `TH-${idSuffix}`, // ดึงแค่ 5 ตัวสุดท้ายจากเลขและเพิ่ม 'TH-' นำหน้า
            };
        });

        setPromotions(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPromotions();
  }, []);
 

  const filteredPromotions = selectedType
    ? promotions.filter((promo) => promo.duration === selectedType)
    : promotions;

  const totalPages = Math.ceil(filteredPromotions.length / promotionsPerPage);

  const currentPromotions = filteredPromotions.slice(
    (currentPage - 1) * promotionsPerPage,
    currentPage * promotionsPerPage
  );

  const handleFilter = (type) => {
    if (selectedType === type) {
      setSelectedType(null); // ยกเลิกการกรอง
    } else {
      setSelectedType(type); // กรองตามประเภทที่เลือก
      setCurrentPage(1); // รีเซ็ตหน้าเป็นหน้าแรก
    }
  };
  

 

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };


  // ฟังก์ชันแปลงเดือนจากตัวเลขเป็นตัวย่อภาษาไทย
const convertToThaiMonth = (monthNumber) => {
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  return months[monthNumber - 1];
};
    
  return (
    <div>
      

      <div className="promotion-container" ref={promotionsRef}>
      <h2 className="promotion-title-top">โปรโมชันกิจกรรมท่องเที่ยว</h2>
        <div className="promotion-underline" />

         {/* ปุ่มกรอง */}
         <div className="promotion-filter-container">
          {[...new Set(promotions.map((promo) => promo.duration))].map((type) => (
            <button
              key={type}
              className={`promotion-filter-button ${selectedType === type ? 'active' : ''}`}
              onClick={() => handleFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>


        <div className="promotion-list">
          {currentPromotions.map((promo, index) => (
            <div className="promotion-card" key={index}>
              <img className="promotion-image" src={promo.image} alt={promo.name} />
              <h3 className="promotion-name">{promo.name}</h3>
              <p className="promotion-details">{promo.details}</p>

                {/* เส้นคั่นแนวนอนหลังจากรายละเอียดทัวร์ */}
                <hr className="promotion-last-horizontal-line"/>

              
              <div className="promotion-details-container">
                <div className="promotion-detail-block">
                <div className="promotion-detail-header">
                <div className="promotion-icon">
                    <FaCalendarAlt />
                  </div>
                  <p className="promotion-detail-title">ระยะเวลา</p>
                </div>
                <p className="promotion-detail-text">{promo.duration}</p>
                </div>

                 {/* เส้นคั่นแนวตั้งระหว่างไอคอน */}
                 <div className="promotion-vertical-line" />

                <div className="promotion-detail-block">
                <div className="promotion-detail-header">
               
                <div className="promotion-icon">
                    <FaTag />
                  </div>
                  <p className="promotion-detail-title">รหัสทัวร์</p>
                  </div>
                <p className="promotion-detail-text">{promo.code}</p>
                </div>

                
               
              </div>

               {/* เส้นคั่นแนวนอนหลังจากรายละเอียด */}
               <hr className="promotion-block-horizontal-line"/>
            
<div className="promotion-departure-info">
  {[...Array(3)] // สร้างอาร์เรย์เพื่อให้มี 3 ช่อง (0, 1, 2)
    .map((_, index) => {
      const dep = promo.departure.filter((d, idx) => idx === index)[0]; // กรองให้ได้ข้อมูลแต่ละรายการที่ตรงกับ index
      return dep ? (
        <div key={index} className="promotion-departure-item">
          {/* แสดงเดือนเป็นปุ่มสีส้ม */} <button className="promotion-month-button">{convertToThaiMonth(Number(dep.start_date.slice(3, 5)))}</button>
          {/* แสดงช่วงวันที่ (start_date - end_date) */}
          <span >{dep.start_date} - {dep.end_date}</span>
        </div>
      ) : (
        // ถ้าไม่มีข้อมูลในช่วงนั้น แสดงช่องว่างเท่ากับรูปแบบข้อมูล
        <div key={index} className="promotion-departure-item empty">
           <button className="promotion-month-button"></button>
           <span className="promotion-date-range"></span>
        </div>
      );
    })}
</div>





              {/* เส้นคั่นแนวนอนหลังจากรายละเอียด */}
<hr className="promotion-last-horizontal-line"/>

<div className="promotion-price-container">
  {/* ราคาเริ่มต้น */}
  <div className="promotion-starting-price-text">เริ่มต้น</div>

  {/* ราคาและปุ่มดูรายละเอียด */}
  <div className="promotion-price-info-container">
    <div className="promotion-price-info">
      <div className="promotion-price">{promo.price}</div>
      <span className="promotion-price-unit">บาท/ท่าน</span>
    </div>
    <button className="promotion-button" onClick={() => handleDetailClick(promo.id)}>ดูรายละเอียด</button>
  </div>
</div>

            </div>
          ))}
        </div>
        {/* ใช้ Pagination คอมโพเนนต์ */}
  <Pagination
    totalPages={totalPages}
    currentPage={currentPage}
    handlePageClick={handlePageClick}
  />
      </div>
    </div>
  );
};



export default Promotions;
