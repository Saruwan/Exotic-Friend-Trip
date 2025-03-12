import React, { useState, useEffect, useRef } from "react";
import 'font-awesome/css/font-awesome.min.css';
import styled from "styled-components";

// สร้าง styled-component สำหรับเส้นใต้
const Underline = styled.div`
  width: 150px;
  height: 3px;
  background-color: #003580;
  margin: 0 auto 30px;
`;

function TourPage() {
  const [selectedCategory, setSelectedCategory] = useState("ดูทั้งหมด");
  const [showAll, setShowAll] = useState(false); // เพิ่มสถานะ showAll
 
  const cardContainerRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // เช็กว่าคลิกอยู่นอก container ของการ์ดหรือไม่
      if (
        cardContainerRef.current &&
        !cardContainerRef.current.contains(event.target)
      ) {
        setShowAll(false); // ปิด showAll
      }
    };

    // เพิ่ม Event Listener เมื่อ mount
    document.addEventListener("click", handleClickOutside);

    return () => {
      // ลบ Event Listener เมื่อ unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array เพื่อทำครั้งเดียว

  const articles = [
    {
      title: "อร่อยทั่วไทยกับทัวร์กิน",
      description: "สำรวจเมนูเด็ดทั่วไทย...",
      image: "b1.jpg",
      category: "ทัวร์พากิน",
      location: "กรุงเทพฯ",
      date: "30 ม.ค. 22",
      views: 345,
    },
    {
        title: "อร่อยทั่วไทยกับทัวร์กิน",
        description: "สำรวจเมนูเด็ดทั่วไทย...",
        image: "b2.jpg",
        category: "ทัวร์พากิน",
        location: "กรุงเทพฯ",
        date: "30 ม.ค. 22",
        views: 345,
      },
      {
        title: "อร่อยทั่วไทยกับทัวร์กิน",
        description: "สำรวจเมนูเด็ดทั่วไทย...",
        image: "b3.jpg",
        category: "ทัวร์พากิน",
        location: "กรุงเทพฯ",
        date: "30 ม.ค. 22",
        views: 345,
      },
    {
      title: "เที่ยวกับเทคโนโลยี",
      description: "สัมผัสประสบการณ์ใหม่...",
      image: "https://via.placeholder.com/300x150",
      category: "ทัวร์ทันสมัย",
      location: "เชียงใหม่",
      date: "1 ก.พ. 22",
      views: 200,
    },
    {
      title: "เที่ยวคนเดียวก็สนุก",
      description: "มาสัมผัสความอิสระ...",
      image: "https://via.placeholder.com/300x150",
      category: "ทัวร์คนเดียว",
      location: "ภูเก็ต",
      date: "15 ม.ค. 22",
      views: 150,
    },
    {
      title: "พร้อมเที่ยวทั่วโลก",
      description: "เตรียมตัวก่อนออกเดินทาง...",
      image: "https://via.placeholder.com/300x150",
      category: "ทัวร์พร้อม",
      location: "พัทยา",
      date: "10 ก.พ. 22",
      views: 220,
    },
    {
      title: "พร้อมเที่ยวทั่วโลก",
      description: "เตรียมตัวก่อนออกเดินทาง...",
      image: "https://via.placeholder.com/300x150",
      category: "ทัวร์พร้อม",
      location: "พัทยา",
      date: "10 ก.พ. 22",
      views: 220,
    },
    {
      title: "ช้อปสนุกทุกที่",
      description: "รวมสถานที่ช้อปปิ้งที่ดีที่สุด...",
      image: "https://via.placeholder.com/300x150",
      category: "ทัวร์ช้อป",
      location: "หาดใหญ่",
      date: "5 ก.พ. 22",
      views: 100,
    },
    {
      title: "อร่อยทั่วไทยกับทัวร์กิน",
      description: "สำรวจเมนูเด็ดทั่วไทย...",
      image: "b1.jpg",
      category: "ทัวร์พากิน",
      location: "กรุงเทพฯ",
      date: "30 ม.ค. 22",
      views: 345,
    },
  ];

  
  const categories = [
    { icon: "fa fa-cutlery", label: "ทัวร์พากิน" },
    { icon: "fa fa-mobile", label: "ทัวร์ทันสมัย" },
    { icon: "fa fa-user", label: "ทัวร์คนเดียว" },
    { icon: "fa fa-plane", label: "ทัวร์พร้อม" },
    { icon: "fa fa-shopping-bag", label: "ทัวร์ช้อป" },
    { icon: "fa fa-search", label: "ดูทั้งหมด" },
  ];

  const articlesToDisplay = showAll ? articles : articles.slice(0, 6); // ใช้ slice เพื่อจำกัดจำนวนแถว

  const styles = {
    header: {
      textAlign: "center",
      margin: "20px",
      color: "#003580",
    },
    
    categories: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      margin: "20px 0",
      flexWrap: "wrap",
    },
    category: {
      textAlign: "center",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "10px 15px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    categoryIcon: {
      fontSize: "2rem",
      color: "#003580",
    },
    articles: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 300px)",
        gap: "20px",
        justifyContent: "center",
        margin: "20px",
      },
      // สไตล์สำหรับกรณีที่ขนาดหน้าจอลดลง
  '@media (max-width: 1200px)': {
    articles: {
      gridTemplateColumns: "repeat(2, 1fr)", // 2 คอลัมน์เมื่อหน้าจอเล็กลง
    },
  },
  '@media (max-width: 768px)': {
    articles: {
      gridTemplateColumns: "1fr", // 1 คอลัมน์เมื่อหน้าจอเล็กสุด
    },
  },
      article: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        width: "300px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    articleImageContainer: {
      position: "relative",
    },
    articleImage: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
    },
    articleButton: {
      position: "absolute",
      top: "10px",
      left: "10px",
      backgroundColor: "#FFA500",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "0.9rem",
    },
    articleContent: {
      padding: "15px",
    },
    title: {
      color: "#003580",
      fontWeight: "bold",
      margin: "0 0 10px 0",
    },
    description: {
      color: "#003580",
      fontWeight: "lighter",
      margin: "0 0 15px 0",
    },
    divider: {
      borderTop: "1px dashed #ddd",
      margin: "10px 0",
    },
    articleFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.9rem",
      color: "#6c757d",
    },
    footerIcon: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    shareButton: {
      backgroundColor: "#f9f9f9",
      borderRadius: "5px",
      padding: "5px",
      cursor: "pointer",
    },
  };

  
  const filteredArticles =
    selectedCategory === "ดูทั้งหมด"
      ? articlesToDisplay
      : articles.filter((article) => article.category === selectedCategory);

      const lastRowCardCount = filteredArticles.length % 3;
      
  return (
    <div>
      <div style={styles.header}>
        <h1>บทความจากทัวร์</h1>
        <p>
          สัมผัสทุกไลฟ์สไตล์ ทั้งกิน เที่ยว ช้อป เตรียมพร้อมและอัพเดตเรื่องราวต่างๆ
          ทั่วทุกมุมโลก
        </p>
        <Underline />
      </div>

      <div style={styles.categories}>
        {categories.map((category, index) => (
          <div
            style={{
              ...styles.category,
              backgroundColor: category.label === selectedCategory ? "#003580" : "#fff",
              color: category.label === selectedCategory ? "#fff" : "#000",
            }}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <i
              className={`${category.icon}`}
              style={{
                ...styles.categoryIcon,
                color: category.label === selectedCategory ? "#fff" : "#003580",
              }}
            ></i>
            <p>{category.label}</p>
          </div>
        ))}
      </div>
   <div ref={cardContainerRef}>
      <div
        style={{
          ...styles.articles,
          display: filteredArticles.length < 3 ? "flex" : "grid",
          justifyContent: filteredArticles.length < 3 ? "center" : "center",
          gap: filteredArticles.length < 3 ? "30px" : "20px",
          
        }}
      >
        {filteredArticles.map((article, index) => (
          <div style={styles.article} key={index}>
            <div style={styles.articleImageContainer}>
              <img
                src={article.image}
                alt={article.title}
                style={styles.articleImage}
              />
              <div style={styles.articleButton}>
                {article.category} | {article.location}
              </div>
            </div>
            <div style={styles.articleContent}>
              <h3 style={styles.title}>{article.title}</h3>
              <p style={styles.description}>{article.description}</p>
              <div style={styles.divider}></div>
              <div style={styles.articleFooter}>
                <div style={styles.footerIcon}>
                  <i className="fa fa-calendar"></i>
                  <span>{article.date}</span>
                </div>
                <div style={styles.footerIcon}>
                  <i className="fa fa-eye"></i>
                  <span>{article.views}</span>
                </div>
                <div style={styles.shareButton}>
                  <i className="fa fa-share"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

{/* ปุ่มดร็อปดาวน์ "แสดงเพิ่มเติม" */}
{filteredArticles.length >= 6 && (
  <div
    style={{
      textAlign: "center",
      marginTop: "20px",
      color: "#003580", // สีข้อความเป็นสีน้ำเงิน
      fontWeight: "bold", // ทำให้ข้อความดูเด่นขึ้น
      cursor: "pointer", // เปลี่ยนตัวชี้เมาส์เมื่อวางบนปุ่ม
      display: "flex", // ใช้ Flexbox เพื่อจัดแนวข้อความกับไอคอน
      justifyContent: "center",
      alignItems: "center",
      gap: "10px", // เพิ่มช่องว่างระหว่างข้อความกับไอคอน
    }}
    onClick={() => setShowAll(!showAll)}
  >
    {showAll ? (
      <>
        แสดงน้อยลง<i className="fa fa-chevron-up"></i> {/* ลูกศรชี้ขึ้น */}
      </>
    ) : (
      <>
        แสดงเพิ่มเติม<i className="fa fa-chevron-down"></i> {/* ลูกศรชี้ลง */}
      </>
    )}
  </div>
)}
  </div>

    </div>
  );
}

export default TourPage;