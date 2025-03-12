import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faUtensils, faCutlery, faCube, faCheck } from "@fortawesome/free-solid-svg-icons";

import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import "./TourCardDetails.css"
const TourCardDetails = () => {
  // สถานะการเปิด-ปิดดรอปดาวน์
  const [expandedDay, setExpandedDay] = useState(null);

  const { id } = useParams(); // รับ id จาก URL
  const [tourInfo, setTourInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/travel_api?id=${id}`
        );
        const data = await response.json();

        // กรองข้อมูลตาม id
        const tour = data.find(
          (item) => item.idWebsite_TravelCenterDatabase === id
        );

        if (tour) {
          console.log("Itinerary:", tour.Itinerary);
          console.log("Plan:", tour.Itinerary?.[0]?.plan);

          // แปลงข้อมูลให้ตรงกับโครงสร้างที่ต้องการ
          const formattedTour = {
            id: tour.idWebsite_TravelCenterDatabase,
            description: tour.description,
            duration: tour.excursion_type,

            programDetails: (tour.Itinerary?.[0]?.plan || []).map(
              (planItem) => ({
                day: planItem?.time || "ไม่มีข้อมูล",
                details: planItem?.title || "ไม่มีข้อมูล",
                detailDescriptions: planItem?.description || "",
                images: planItem?.imageURL
                  ? [planItem.imageURL]
                  : ["https://via.placeholder.com/300"],
              })
            ),

            thumbnails: (tour.gallery_bottom || []).map((img) => img.imageURL || "https://via.placeholder.com/150"
            ),
// สิ่งอำนวยความสะดวก (ดึงจาก with_meal โดยตรง พร้อมไอคอนเฉพาะ)
facilities: tour.with_meal
  ? tour.with_meal.split(',').map(meal => {
      const trimmedMeal = meal.trim();
      let icon = ""; // ค่าไอคอนเริ่มต้น

      // กำหนดไอคอนตามประเภทของมื้ออาหาร
      if (trimmedMeal === "Breakfast") icon = faCoffee;
      else if (trimmedMeal === "Lunch") icon = faCutlery;
      else if (trimmedMeal === "Dinner") icon = faUtensils;
      else if (trimmedMeal === "Snack") icon = faCube;

      return { name: trimmedMeal, icon }; // คืนค่าเป็น object
    })
  : [],

          // ไฮไลท์
          highlights: tour.id_destination
            ? tour.id_destination.split(',').map(destinationId => ` ${destinationId}`)
            : [],

          // ค่าใช้จ่ายรวม (จาก tripInclude)
          includedCosts: (tour.tripInclude || []).map((item) => item.text),

          // ค่าใช้จ่ายไม่รวม (จาก additionalSurcharge)
          excludedCosts: (tour.additionalSurcharge || []).map(
            (surcharge) => `${surcharge.listname}: ฿${surcharge.price}`
        ),
          };

          setTourInfo(formattedTour);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!tourInfo) {
    return <p>No data available for ID: {id}</p>;
  }
  if (!tourInfo.Itinerary || !tourInfo.Itinerary[0]?.plan) {
    console.error("Itinerary หรือ Plan ไม่มีข้อมูลสำหรับ ID นี้");
  }

  return (
    <div className="d-container">
      {/* ส่วนที่ 1: เกี่ยวกับทัวร์ */}
      <section className="d-section">
      <div className="d-title-container">
      <div className="d-title-symbol"></div>
        <h3 className="d-title">เกี่ยวกับทัวร์</h3>
        </div>
        <p className="d-description">{tourInfo.description}</p>
        <div className="d-separator" />
      </section>

    {/* ส่วนที่ 2: สิ่งอำนวยความสะดวก */}
<section className="d-section">
<div className="d-title-container">
<div className="d-title-symbol"></div>
  <h3 className="d-title">สิ่งอำนวยความสะดวก</h3>
  </div>
  <div className="d-facilities">
  {tourInfo.facilities.map((facility, index) => (
    <div key={index} className="d-facility-item">
      <FontAwesomeIcon icon={facility.icon} className="d-icon" />

        <span>{facility.name}</span>
      </div>
    ))}
  </div>
  <div className="d-separator" />
</section>



      {/* ส่วนที่ 3: ไฮไลท์ */}
      <section className="d-section">
      <div className="d-title-container">
      <div className="d-title-symbol"></div>
        <h3 className="d-title">ไฮไลท์</h3>
        </div>
        <div className="d-highlights">
          {tourInfo.highlights.map((highlight, index) => (
            <div key={index} className="d-highlight-item">
              <div className="d-check-icon-orange">
                
<FontAwesomeIcon icon={faCheck} className="d-check-icon" />
              </div>
              <span>{highlight}</span>
            </div>
          ))}
        </div>
        <div className="d-separator" />
      </section>

      {/* ส่วนที่ 4: ค่าใช้จ่าย */}
      <section className="d-section">
      <div className="d-title-container">
      <div className="d-title-symbol"></div>
        <h3 className="d-title">ค่าใช้จ่าย</h3>
        </div>
        <div className="d-expense-container">
          <div className="d-expense-group">
            <h4 className="d-expense-header">ค่าใช้จ่ายรวม</h4>
            {tourInfo. includedCosts.map((cost, index) => (
              <div key={index} className="d-expense-item">
                <div className="d-check-icon-green">
                 
<FontAwesomeIcon icon={faCheck} className="d-check-icon" />
                </div>
                <span>{cost}</span>
              </div>
            ))}
          </div>

          <div className="d-expense-group">
            
            <h4 className="d-expense-header">ค่าใช้จ่ายไม่รวม</h4>
            {tourInfo. excludedCosts.map((cost, index) => (
              <div key={index} className="d-expense-item">
                <div className="d-check-icon-red">
                 
<FontAwesomeIcon icon={faCheck} className="d-check-icon" />
                </div>
                <span>{cost}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};



export default TourCardDetails;