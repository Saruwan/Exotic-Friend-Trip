import React, { useState } from "react";
import "./Footer.css"; // CSS ไฟล์สำหรับจัดการสไตล์

function Footer() {

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <h2>ติดตามเพื่อรับโปรโมชั่น</h2>
        <div className="subscription">
          <input
            type="email"
            placeholder="ใส่อีเมลของคุณ"
            className="email-input"
          />
          <button className="subscribe-button">รับโปรโมชั่น</button>
          <span className="or">หรือ</span>
          <div
            className="qr-code"
         
          >
            <img
              src="qr-line.png"
              alt="QR Code"
              
            />
            <p>ติดตามเราผ่านไลน์<br />@pkindev</p>
          </div>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-column">
          <a href="#">แนะนำสถานที่ท่องเที่ยว</a>
          <a href="#">บทความท่องเที่ยว</a>
          <a href="#">โปรโมชั่นกิจกรรม</a>
        </div>
        <div className="footer-column">
          <a href="#">แพ็คเกจท่องเที่ยว</a>
          <a href="#">โปรแกรมท่องเที่ยว</a>
          <a href="#">แกลลอรี่</a>
        </div>
        <div className="footer-column">
          <a href="#">ข่าวจาก Exotic Friend Trip</a>
          <a href="#">ลูกค้าของเรา</a>
          <a href="#">คำรับรองจากลูกค้า</a>
        </div>
        <div className="footer-column">
          <a href="#">การชำระเงิน</a>
          <a href="#">ติดต่อเรา</a>
          <a href="#">เกี่ยวกับเรา</a>
        </div>
        
         {/* Scroll to top button */}
      <button className="scroll-to-top" onClick={scrollToTop}>
        ^ 
      </button>
      </div>
      <div className="footer-bottom" id="footer">
        <p>
        Copyright 2024 © Phuket Innovative Development Co., Ltd.
        </p>
      </div>
   
           
          
    </footer>
  );
}

export default Footer;
