import React, { useEffect, useState } from "react";
import {FaMapMarked} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Pagination from "./PaginationList";
import FilterBox from "./FilterBox";
import "./TourList.css";
const TourList = () => {
  const [filters, setFilters] = useState({
    budget: [0, 20000], // ค่าเริ่มต้นราคา (ต่ำสุด, สูงสุด)
    startDate: "",
    endDate: "",

    duration: [],
    location: [],
  });

  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 7; // กำหนด 7 รายการต่อหน้า
  const [allTourDates, setAllTourDates] = useState([]); // เก็บวันที่ทั้งหมด
  const navigate = useNavigate();

  const handleDetailClick = (idWebsite_TravelCenterDatabase) => {
    navigate(`/TourCard/${idWebsite_TravelCenterDatabase}`);
  };

  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/"); // แยกวันที่, เดือน, ปี
    return new Date(`${year}-${month}-${day}`); // สร้าง Date โดยใช้รูปแบบ yyyy-mm-dd
  }

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:8000/travel_api");
        const data = await response.json();

        // จัดรูปแบบข้อมูลจาก API
        const formattedTours = data.map((item) => ({
          idWebsite_TravelCenterDatabase: item.idWebsite_TravelCenterDatabase,
          image: item.profile?.imageURL,
          title: item.tour_excursion_name,
          duration: item.excursion_type,
          price: item.price_info?.[0]?.adult_price
            ? `${parseInt(item.price_info[0].adult_price).toLocaleString()}`
            : 0,
          tourCode: item.idWebsite_TravelCenterDatabase,
          places: [item.id_province],
          id_province: item.id_province,
          dates: item.price_info.map((info) => ({
            start: info.start_date ? parseDate(info.start_date) : null, // แปลง start_date
            end: info.end_date ? parseDate(info.end_date) : null, // แปลง end_date
            adult_price: info.adult_price,
          })),
        }));

        // ✅ เก็บวันที่ทั้งหมดของทัวร์ (กรองเฉพาะค่าที่เป็น `Date`)
        const allTourDates = formattedTours.flatMap((tour) =>
          tour.dates
            .map((date) =>
              date.start instanceof Date && !isNaN(date.start)
                ? date.start
                : null
            )
            .filter((date) => date !== null)
        );

        console.log("🔹 รายการวันที่ทั้งหมดของทุกทัวร์:", allTourDates);

        setTours(formattedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  // ฟังก์ชันแปลงเดือนจากตัวเลขเป็นตัวย่อภาษาไทย
  const convertToThaiMonth = (monthNumber) => {
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return months[monthNumber - 1];
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const prepareFilters = () => {
    const allPrices = tours.flatMap((tour) =>
      tour.dates.map((date) => parseInt(date.adult_price) || 0)
    );
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const startDates = [
      ...new Set(tours.flatMap((tour) => tour.dates.map((date) => date.start))),
    ];

    const durations = [...new Set(tours.map((tour) => tour.duration))];
    const locations = [...new Set(tours.map((tour) => tour.id_province))];

    return {
      budgetRange: [minPrice, maxPrice],
      startDates,
      durations,
      locations,
    };
  };

  const { budgetRange, startDates, durations, locations } = prepareFilters();

  const filterTours = () => {
    return tours.filter((tour) => {
      const { budget, duration, location, startDate, endDate } = filters;

      // กรองตามงบประมาณ (ต้องอยู่ระหว่าง budget[0] และ budget[1])
      const allPrices = tour.dates.map((date) => parseInt(date.adult_price));
      const minPrice = Math.min(...allPrices);
      if (minPrice < budget[0] || minPrice > budget[1]) return false;

      // กรองตามจำนวนวัน
      if (duration.length && !duration.includes(tour.duration)) return false;

      // กรองตามทำเลที่ตั้ง
      if (
        filters.location.length &&
        !filters.location.includes(tour.id_province)
      ) {
        return false;
      }

      // ✅ กรองตามวันที่ที่เลือก (ตรวจสอบ `date.start` ก่อนใช้งาน)
      if (startDate) {
        const tourDates = tour.dates
          .map((date) =>
            date.start instanceof Date && !isNaN(date.start)
              ? date.start.toDateString()
              : null
          )
          .filter((date) => date !== null);

        if (!tourDates.includes(new Date(startDate).toDateString())) {
          return false;
        }
      }

      return true;
    });
  };

  const handleDurationChange = (day) => {
    const updatedDuration = filters.duration.includes(day)
      ? filters.duration.filter((d) => d !== day) // ถ้ามีอยู่แล้วให้เอาออก
      : [...filters.duration, day]; // ถ้ายังไม่มีให้เพิ่มเข้าไป
    setFilters({ ...filters, duration: updatedDuration });
  };

  // ฟังก์ชันสำหรับดึงข้อมูลตามหน้า
  const currentTours = () => {
    const filteredTours = filterTours();
    const indexOfLastTour = currentPage * cardsPerPage;
    const indexOfFirstTour = indexOfLastTour - cardsPerPage;
    return filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  };

  const totalPages = Math.ceil(filterTours().length / cardsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="list-container">
      
      <FilterBox
        filters={filters}
        onFilterChange={setFilters}
        budgetRange={budgetRange}
        durations={durations}
        locations={locations}
        allTourDates={allTourDates}
      />

      <div className="list-content">
        {currentTours().map((tour) => (
          <div className="list-tour-card" key={tour.idWebsite_TravelCenterDatabase}>
            <div className="list-flex-container">
              {/* ฝั่งซ้าย - รูปภาพและข้อมูล */}
              <div className="list-left-section">
                <img src={tour.image} alt={tour.title} className="list-image" />
                <div className="list-tour-info-container">
                  {/* ชื่อทัวร์ */}
                  <h4 className="list-title">{tour.title}</h4>

                  {/* ชื่อสถานที่ */}
                  <p className="list-places">
                    <FaMapMarked className="list-icons" />
                    {tour.places.join(" - ")}
                  </p>

                  {/* เดือนและรหัสทัวร์ */}

                  {/* เดือนและรหัสทัวร์ */}
                  <div className="list-departure-info">
                    <span>มีจำหน่ายตลอดทั้งปี</span>
                    {tour.dates.map((_, index) => {
                      const date = tour.dates.filter(
                        (date, idx) => idx === index
                      )[0];
                      return date ? (
                        <button key={index} className="list-month-button">
                          {convertToThaiMonth(date.start.getMonth() + 1)}
                        </button>
                      ) : (
                        <button
                          key={index}
                          className="list-month-button hidden"
                        >
                          ---
                        </button>
                      );
                    })}
                  </div>

                  {/* เส้นแบ่ง */}
                  <div className="list-horizontal-line"></div>

                  {/* รหัสทัวร์และจำนวนวัน */}
                  <div className="list-price">
                    <p className="list-price-unit">
                      รหัสทัวร์{" "}
                      <span className="list-price-text">{tour.tourCode}</span>
                    </p>
                    <p className="list-price-unit">
                      จำนวนวัน{" "}
                      <span className="list-price-text">{tour.duration}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* เส้นแบ่งระหว่างคอลัมน์ */}
              <div className="list-divider"></div>

              <div className="list-price-container">
                <div className="list-price-details">
                  <p className="list-price-label">ราคา</p>
                  <p className="list-price-value">฿ {tour.price.toLocaleString()}</p>
                </div>

                <div className="list-detail-button-container">
                  <a
                    className="list-detail-button"
                    onClick={() =>
                      handleDetailClick(tour.idWebsite_TravelCenterDatabase)
                    }
                  >
                    ดูรายละเอียด
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ใช้คอมโพเนนต์ Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default TourList;
