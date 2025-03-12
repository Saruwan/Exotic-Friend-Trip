import React, { useState, useEffect } from "react";
import BookingOptions from "./BookingOptions";
import "./Step2.css"
const Step2 = ({ onDataChange, initialValues, nextStep  }) => {


  const [formData, setFormData] = useState(initialValues || {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    note: "",
    lineId: "", // เพิ่มข้อมูลไลน์ไอดี
    whatsapp: "", // เพิ่มข้อมูล WhatsApp
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  
// แก้ไข useEffect สำหรับโหลดข้อมูลจาก localStorage
useEffect(() => {
  const savedData = JSON.parse(localStorage.getItem("step2Data"));
  if (savedData) {
    setFormData(savedData);
  } else {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      const [firstName = "", lastName = ""] = userData.name
        ? userData.name.split(" ")
        : ["", ""];
      setFormData({
        firstName,
        lastName,
        phone: userData.phone || "",
        email: userData.email || "",
        note: "",
        lineId: userData.lineId || "", // ดึงข้อมูลจาก localStorage
        whatsapp: userData.whatsapp || "", // ดึงข้อมูลจาก localStorage
      });
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem("step2Data", JSON.stringify(formData));
 if (onDataChange) {
   onDataChange({
     ...formData,
    
     isCheckboxChecked, 
    
   
   });
 }
}, [formData, onDataChange, isCheckboxChecked,  ]);


  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    localStorage.setItem("step2Data", JSON.stringify(updatedFormData));
  
    // ลบข้อความเออเรอร์เมื่อมีการพิมพ์ชื่อและนามสกุล
    if (e.target.name === "firstName" || e.target.name === "lastName") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
  
      // เมื่อผู้ใช้ลบชื่อหรือนามสกุล ให้แสดงข้อความเตือนใหม่
      if (!updatedFormData.firstName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: "กรุณากรอกชื่อ",
        }));
      }
      if (!updatedFormData.lastName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: "กรุณากรอกนามสกุล",
        }));
      }
    }
  
    // เช็คและแสดงข้อความ "รูปแบบไม่ถูกต้อง" สำหรับอีเมลและเบอร์โทร
    if (e.target.name === "phone") {
      if (!/^\d{10}$/.test(updatedFormData.phone)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "รูปแบบไม่ถูกต้อง",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "",
        }));
      }
    }
  
    if (e.target.name === "email") {
      if (!/\S+@\S+\.\S+/.test(updatedFormData.email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "รูปแบบไม่ถูกต้อง",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }
  
    // เมื่อผู้ใช้ลบข้อมูลในช่องให้แสดงข้อความเตือนใหม่
    if (e.target.name === "phone" && updatedFormData.phone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "กรุณากรอกหมายเลขโทรศัพท์",
      }));
    }
    if (e.target.name === "email" && updatedFormData.email === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "กรุณากรอกอีเมล",
      }));
    }
  };
  
 


  const handleCheckboxChange = () => {
    if (validateForm()) {
      setIsCheckboxChecked(!isCheckboxChecked); // เปลี่ยนสถานะของเช็คบ็อกซ์
    }
  };

  

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อ";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "กรุณากรอกหมายเลขโทรศัพท์";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "กรุณากรอกอีเมล";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ถ้าไม่มีข้อผิดพลาด จะสามารถติ๊กเช็คบ็อกซ์ได้
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
   <div className="step2-form-container">
            <form >
              <div className="step2-row">
                <div className="step2-input-group">
                  <label className="step2-label">ชื่อ *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="กรุณากรอกชื่อ"
                    className={`step2-input ${errors.firstName ? "error" : ""}`}
                  />
                  {errors.firstName && (
                    <span className="step2-error-text">{errors.firstName}</span>
                  )}
                </div>
                <div className="step2-input-group">
                  <label className="step2-label">นามสกุล *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="กรุณากรอกนามสกุล"
                    className={`step2-input ${errors.lastName ? "error" : ""}`}
                  />
                  {errors.lastName && (
                    <span className="step2-error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>
              <div className="step2-row">
                <div className="step2-input-group">
                  <label className="step2-label">หมายเลขโทรศัพท์ *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="กรุณากรอกหมายเลขโทรศัพท์"
                    className={`step2-input ${errors.phone ? "error" : ""}`}
                  />
                  {errors.phone && (
                    <span className="step2-error-text">{errors.phone}</span>
                  )}
                </div>
                <div className="step2-input-group">
                  <label className="step2-label">อีเมล *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="กรุณากรอกอีเมล"
                    className={`step2-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && (
                    <span className="step2-error-text">{errors.email}</span>
                  )}
                </div>
              </div>
               {/* เพิ่มข้อมูล Line ID และ WhatsApp */}
            <div className="step2-row">
              <div className="step2-input-group">
                <label className="step2-label">Line ID</label>
                <input
                  type="text"
                  name="lineId"
                  value={formData.lineId}
                  onChange={handleChange}
                  placeholder="กรุณากรอก Line ID (ถ้ามี)"
                  className={`step2-input ${errors.lineId ? "error" : ""}`}
                />
              
              </div>
              <div className="step2-input-group">
                <label className="step2-label">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="กรุณากรอก WhatsApp (ถ้ามี)"
                  className={`step2-input ${errors.lineId ? "error" : ""}`}
                />
               
              </div>
            </div>

              <div className="step2-input-group">
                <label className="step2-label">หมายเหตุ</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="ระบุหมายเหตุ (ถ้ามี)"
                 className="step2-textarea"
                />
              </div>
              <div className="step2-terms-container">
  <div className="step2-checkbox-container">
    <input
      type="checkbox"
      id="terms"
      checked={isCheckboxChecked}
      onChange={handleCheckboxChange}
      className="step2-checkbox"
    />
    <label htmlFor="terms" className="step2-checkbox-label">
      ฉันอ่านข้อตกลงเรียบร้อยแล้วและยอมรับในเงื่อนไข
    </label>
  </div>

  {/* ปุ่มยืนยันการจอง */}
  <button 
   className={`step2-submit-btn ${isCheckboxChecked ? "active" : "inactive"}`}
    disabled={!isCheckboxChecked}
    onClick={nextStep}
  >
    {isMobile ? "ยืนยัน" : "ยืนยันการจอง"}
  </button>
</div>

            </form>
            </div>
  );
};


export default Step2;
