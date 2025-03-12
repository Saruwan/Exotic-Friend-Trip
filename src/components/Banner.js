import React, { useState } from 'react';
import AdBanner from './AdBanner';
import ImageSlider from './ImageSlider';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaCalendarAlt, FaHotel, FaTag, FaHome, FaSuitcase, FaPassport, FaShip, FaCar, FaMoneyBillAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./Banner.css"
const TravelSearch = () => {
    const [startDate, setStartDate] = useState(null); // จัดการวันที่เริ่มต้น
    const [endDate, setEndDate] = useState(null); // จัดการวันที่สิ้นสุด
  
    const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/TourList');
  };

  const [selectedIcon, setSelectedIcon] = useState('แพ็คเกจท่องเที่ยว');
  const [searchPlaceholder, setSearchPlaceholder] = useState('ค้นหาชื่อทัวร์');

  const handleIconClick = (iconLabel, placeholderText) => {
    setSelectedIcon(iconLabel);
    setSearchPlaceholder(placeholderText);
  };

  return (
    <div className="banner-container">
      <div className="banner-background-gray" />
      <div className="banner-background-blue" />
      <div className="banner-background-image" />
      <div className="banner-overlay" />
      <div className="banner-content">
      <div className="banner-top-content">
      <div className="banner-left-column">
        <h1 className="banner-title">ENJOY YOUR <span>TRAVELING</span></h1>
        <p className="banner-description">
          Our travel agency is ready to offer you an exciting vacation that is designed to fit your own needs and wishes. Whether it is an exotic cruise or a trip to your favorite resort, you will surely have the best experience.
        </p>
        </div>
        <div className="banner-right-column">
        <ImageSlider />
        </div>
        </div>

        <div className="banner-search-container">
          <div className="banner-icon-box">
        <div className="banner-icon-container">
          <div className="banner-icon-item" onClick={() => handleIconClick('กิจกรรมท่องเที่ยว', 'ค้นหาชื่อหรือสถานที่')}>
            <FaSuitcase size={36} />
            <span className="banner-icon-label">กิจกรรมท่องเที่ยว</span>
            <span className="banner-icon-label-short">กิจกรรม</span>
            {selectedIcon === 'กิจกรรมท่องเที่ยว' && <hr className="banner-hr" />}
          </div>
          <div className="banner-icon-item" onClick={() => handleIconClick('แพ็คเกจท่องเที่ยว', 'ค้นหาชื่อทัวร์')}>
            <FaPassport size={36} />
            <span className="banner-icon-label">แพ็คเกจท่องเที่ยว</span>
            <span className="banner-icon-label-short">แพ็คเกจ</span>
            {selectedIcon === 'แพ็คเกจท่องเที่ยว' && <hr className="banner-hr" />}
          </div>
          <div className="banner-icon-item" onClick={() => handleIconClick('โรงแรม-ที่พัก', 'ชื่อโรงแรม')}>
            <FaHotel size={36} />
            <span className="banner-icon-label">โรงแรม-ที่พัก</span>
            <span className="banner-icon-label-short">โรงแรม</span>
            {selectedIcon === 'โรงแรม-ที่พัก' && <hr className="banner-hr" />}
          </div>
          <div className="banner-icon-item" onClick={() => handleIconClick('วิลล่า', 'ชื่อโรงแรม')}>
            <FaHome size={36} />
            <span className="banner-icon-label">วิลล่า</span>
            <span className="banner-icon-label-short">วิลล่า</span>
            {selectedIcon === 'วิลล่า' && <hr className="banner-hr" />}
          </div>
          <div className="banner-icon-item" onClick={() => handleIconClick('เฟอร์รี่/สปีดโบ๊ท', 'ค้นหาเรือ')}>
            <FaShip size={36} />
            <span className="banner-icon-label">เฟอร์รี่/สปีดโบ๊ท</span>
            <span className="banner-icon-label-short">เฟอร์รี่</span>
            {selectedIcon === 'เฟอร์รี่/สปีดโบ๊ท' && <hr className="banner-hr" />}
          </div>
          <div className="banner-icon-item" onClick={() => handleIconClick('รถเช่า', 'ค้นหาทัวร์ที่มีรถมารับ-ส่ง')}>
            <FaCar size={36} />
            <span className="banner-icon-label">รถเช่า</span>
            <span className="banner-icon-label-short">รถเช่า</span>
            {selectedIcon === 'รถเช่า' && <hr className="banner-hr" />}
          </div>
        </div>
      </div>

        
        
          {/* Search Section */}
      <div className="banner-search-box">
        <div className="banner-search-inputs" >
          <div className="banner-input-group" >
            <FaSearch size={18} />
            <input className="banner-input" placeholder={searchPlaceholder} />
          </div>
        
              <div className="banner-input-group">
                <FaTag size={18} />
                <input className="banner-input"  placeholder="รหัสทัวร์" />
              </div>
              </div>

              <div className="banner-search-inputs">
              <div className="banner-date-input-group">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  placeholderText="วันเดินทางไป"
                  dateFormat="dd/MM/yyyy"
                  className="banner-date-picker"
                />
                <FaCalendarAlt size={18} />
                </div>
              <div className="banner-date-input-group">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate || new Date()}
                  placeholderText="วันเดินทางกลับ"
                  dateFormat="dd/MM/yyyy"
                  className="banner-date-picker"
                />
                 <FaCalendarAlt size={18} />
                 </div>
              
            
             
            <div className="banner-input-group">
            <FaMoneyBillAlt size={18} />
              <select className="banner-dropdown">
                <option>งบประมาณ</option>
                <option>ต่ำกว่า 1000 บาท</option>
                <option>1000 - 5000 บาท</option>
                <option>5000 - 10000 บาท</option>
              </select>
                </div>
                </div>
              <button className="banner-search-button" onClick={handleSearch}>ค้นหา</button>
             
          </div>
        </div>
        
      </div>
      
    </div>
  );
};



export default TravelSearch;
