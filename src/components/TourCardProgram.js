import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";

const TourCard = () => {
  // สถานะการเปิด-ปิดดรอปดาวน์
  const [expandedDay, setExpandedDay] = useState(null);
  const { id } = useParams(); // รับ id จาก URL
  const [tourInfo, setTourInfo] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchTourInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/travel_api?id=${id}`);
      const data = await response.json();

      const tour = data.find((item) => item.idWebsite_TravelCenterDatabase === id);

      if (tour) {
        console.log("Itinerary:", tour.Itinerary);
        console.log("Plan:", tour.Itinerary?.[0]?.plan);

        const title = tour.Itinerary?.map((itinerary) => itinerary.title); // ดึง title ทั้งหมด

        const formattedTour = {
          id: tour.idWebsite_TravelCenterDatabase,
          duration: tour.excursion_type,
          title: title, // เก็บ title ของโปรแกรม
          programDetails: tour.Itinerary?.map((itinerary) =>
            (itinerary?.plan || []).map((planItem) => ({
              day: planItem?.time || "ไม่มีข้อมูล",
              details: planItem?.title || "ไม่มีข้อมูล",
              detailDescriptions: planItem?.description || "",
              images: planItem?.imageURL ? [planItem.imageURL] : ["https://via.placeholder.com/300"],
              title: planItem?.title,
            }))
          ),
          thumbnails: (tour.gallery_bottom || []).map((img) => img.imageURL || "https://via.placeholder.com/150"),
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

  const styles = {
    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "20px auto",
      fontFamily: "Arial, sans-serif",
    },

    separator: {
      width: "100%",
      height: "1px",
      backgroundColor: "#ddd",
      margin: "10px 0",
    },

    // ...
    programHeader: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#003580",
      marginBottom: "10px",
      textAlign: "left",
    },
    programContent: {
      border: "1px solid #003580",
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "20px",
      fontSize: "16px",
      lineHeight: "1.5",
    },
    dayHeader: {
      padding: "10px",
      borderRadius: "5px",
      fontWeight: "bold",
      color: "#003580",
    },
    dayContent: {
      paddingLeft: "20px",
    },

    icons: {
      marginRight: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* ส่วน "รายละเอียดโปรแกรม" */}
      <h2 style={{ ...styles.programHeader, marginBottom: "20px" }}>
        รายละเอียดโปรแกรม
      </h2>
      {tourInfo.programDetails.length === 0 ? (
        <p style={{ color: "red", textAlign: "center" }}>
          ยังไม่มีโปรแกรมในขณะนี้
        </p>
      ) : (
        tourInfo.programDetails.map((programs, itineraryIndex) => (
          <div key={itineraryIndex}>
            {itineraryIndex > 0 && (
              <div
                style={{
                  ...styles.separator,
                  backgroundColor: "#ddd",
                  height: "1px",
                  margin: "20px 0",
                }}
              />
            )}




        {programs.map((program, index) => (
          <div key={index} style={styles.programContent}>
            <div
              style={{ ...styles.dayHeader, cursor: "pointer" }}
              onClick={() =>
                setExpandedDay(expandedDay === index ? null : index)
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>เวลา {program.day}</span>
                  <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {program.details}
                  </span>
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={() =>
                    setExpandedDay(expandedDay === index ? null : index)
                  }
                >
                  <FontAwesomeIcon
                    icon={expandedDay === index ? faChevronUp : faChevronDown}
                    style={{ color: "#003580", fontSize: "18px" }}
                  />
                </button>
              </div>
            </div>

            {/* แสดงรายละเอียดเมื่อกดดรอปดาวน์ */}
            {expandedDay === index && (
              <div>
                {/* เส้นคั่นสีน้ำเงิน */}
                <div
                  style={{
                    ...styles.separator,
                    backgroundColor: "#003580",
                    height: "1px",
                    marginTop: "1px",
                    width: "100%",
                  }}
                />

                {/* รายละเอียดของสถานที่ */}
                <div style={styles.locationDetails}>
                  <div style={{ marginBottom: "20px" }}>
                    {/* ชื่อสถานที่ */}
                    <strong
                      style={{
                        display: "block",
                        textAlign: "left",
                        fontSize: "18px",
                        marginBottom: "8px",
                        marginLeft: "30px",
                        marginTop: "20px",
                        color: "#003580",
                      }}
                    >
                      {program.details}
                    </strong>

                    {/* รูปภาพ */}
                    {program.images && program.images[0] !== "https://via.placeholder.com/300" && (
                    <img
                        src={program.images}
                        alt={`Location`}
                        style={{
                          ...styles.image,
                          borderRadius: "15px", // ขอบมน
                          width: "700px", // ขยายรูปภาพให้เต็มความกว้าง
                          height: "400px", // ปรับขนาดรูปภาพให้อัตโนมัติ
                          objectFit: "cover", // คงความสวยงามของภาพไม่ให้บิดเบี้ยว
                        }}
                      />
                    )}

                    {/* คำอธิบาย */}
                    <p
                      style={{
                        fontStyle: "italic",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#555",
                        marginBottom: "50px",
                        padding: "15px 20px", // เพิ่มระยะห่างจากขอบด้านซ้าย-ขวา
                        margin: "0 auto", // จัดให้อยู่ตรงกลาง
                        maxWidth: "900px", // จำกัดความกว้างของข้อความ
                        lineHeight: "1.6", // ปรับระยะห่างระหว่างบรรทัดให้อ่านง่ายขึ้น
                      }}
                    >
                      {program.detailDescriptions}
                    </p>
                  </div>
                </div>

                {/* ปุ่มย่อ */}
                <button
                  style={{
                    background: "none",
                    border: "#003580 solid 1px",
                    cursor: "pointer",
                    color: "#003580", // สีของไอคอน
                    fontSize: "15px", // ขนาดของไอคอน
                    marginTop: "10px", // เพิ่มระยะห่างด้านบน (หากต้องการ)
                  }}
                  onClick={() => setExpandedDay(null)}
                >
                  ย่อ <FontAwesomeIcon icon={faChevronUp} />
                </button>
              </div>
            )}
          </div>
          ))}
          </div>
        ))
      )}

    </div>
  );
};

export default TourCard;
