import React from "react";
import { FaFacebook } from "react-icons/fa"; // นำเข้าไอคอน Facebook
import "./Step4.css"
function Step3() {
 


  return (
    
       <div className="step4-page-container">
       {/* ส่วนหัวข้อ "ขั้นตอนที่ 1" */}
       
       
          <p className="step4-container">
            ขอบคุณที่ไว้วางใจ ใช้บริการทัวร์กับ Exotic Friend Trip
          </p>
          <p className="step4-check-seats">
            เจ้าหน้าที่กำลังตรวจเช็คที่นั่ง จะรีบแจ้งให้ท่านทราบนะคะ
            <br />
            ขอบคุณที่ใช้บริการจองทัวร์กับ ExoticFriendTrip.com
          </p>
          <p className="step4-notify-friends">
            บอกให้เพื่อนคุณรู้ว่าคุณได้จองทัวร์นี้กับ Exotic Friend Trip
          </p>
          <button className="step4-button">
        <FaFacebook size={16} color="#fff" /> {/* ใช้ไอคอน Facebook */}
        <span className="step4-button-text">แชร์ไปยัง Facebook</span>
      </button>
          <p className=".step4-terms-header">
            เงื่อนไขการจองทัวร์ใน ExoticFriendTrip.com:
          </p>
          <ul className="step4-terms-list">
            <li>การจองผ่านหน้าเว็บไซต์ เป็นการส่งคำสั่งจองที่ยังถึงบริษัทเท่านั้น ซึ่งจะยังไม่ได้รับการยืนยันจนกว่าเจ้าหน้าที่จะติดต่อกลับยืนยันการจอง และบริษัทฯ ได้รับชำระเงินค่ามัดจำทัวร์เรียบร้อยแล้ว</li>
            <li>ราคาและจำนวนที่นั่งอาจมีการเปลี่ยนแปลง</li>
          </ul>
        
     
      
    </div>
  );
}

export default Step3;