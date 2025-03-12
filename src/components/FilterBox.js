import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // เพิ่ม CSS สำหรับ DatePicker
import "./FilterBox.css"
const FilterBox = ({ filters, onFilterChange, budgetRange, durations, locations, allTourDates,  }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

   // ✅ กรองเฉพาะวันที่เป็น `Date` และไม่ใช่ `NaN`
   const highlightDates = allTourDates.filter(
    (date) => date instanceof Date && !isNaN(date.getTime())
  );

  // ฟังก์ชันสำหรับเปรียบเทียบวันที่
  const isTourDate = (date) => {
    return highlightDates.some(tourDate => {
      const dateStr = date.toDateString();
      const tourDateStr = tourDate.toDateString();
      return dateStr === tourDateStr;  // เปรียบเทียบเฉพาะวันที่
    });
  };


  console.log("🔹 วันที่ที่เลือก:", filters.startDate);

  const handleDurationChange = (day) => {
    const updatedDuration = filters.duration.includes(day)
      ? filters.duration.filter((d) => d !== day)
      : [...filters.duration, day];
    handleFilterChange("duration", updatedDuration);
  };

  const handleLocationChange = (location) => {
    const updatedLocations = filters.location.includes(location)
      ? filters.location.filter((l) => l !== location)
      : [...filters.location, location];
    handleFilterChange("location", updatedLocations);
  };

 

  return (
    
    <div className="filter-box">
      {/* ฟิลเตอร์งบประมาณ */}
      <div className="filter-section">
  <label className="filter-label">กรองตามงบประมาณ</label>

 {/* เส้นหลักของแถบเลื่อน */}
<div className="filter-slider-track">
  {/* เส้นสีส้มระหว่างค่าต่ำสุดและค่าสูงสุด */}
  <div
    className="filter-slider-range"
    style={{
      left: `${((filters.budget[0] - budgetRange[0]) / (budgetRange[1] - budgetRange[0])) * 100}%`,
      width: `${((filters.budget[1] - filters.budget[0]) / (budgetRange[1] - budgetRange[0])) * 100}%`
    }}
  />

  {/* จุดเริ่มต้น */}
  <div
    className="filter-slider-thumb"
    style={{
      left: `${((filters.budget[0] - budgetRange[0]) / (budgetRange[1] - budgetRange[0])) * 100}%`
    }}
  />

  {/* จุดสิ้นสุด */}
  <div
    className="filter-slider-thumb"
    style={{
      left: `${((filters.budget[1] - budgetRange[0]) / (budgetRange[1] - budgetRange[0])) * 100}%`
    }}
  />
</div>


 
  {/* แสดงราคาต่ำสุดและสูงสุดในกรอบ */}
  <div className="filter-budget-container">
  <div className="filter-budget-box">
  <span>฿</span>
  <input
    type="text"
    value={filters.budget[0]}
    onChange={(e) => {
      const value = e.target.value === "" ? "" : Number(e.target.value);
      if (value === "" || (value >= budgetRange[0] && value <= filters.budget[1])) {
        handleFilterChange("budget", [value, filters.budget[1]]);
      }
    }}
    className="filter-budget-input"
  />

</div>

<div className="filter-budget-separator">- - -</div>

    <div className="filter-budget-box">
  <span>฿</span>
  <input
    type="text"  
    value={filters.budget[1]}
    onChange={(e) => {
      const value = e.target.value;
      // ตรวจสอบว่าเป็นตัวเลขที่ไม่ติดลบ
      if (/^\d+$/.test(value) || value === "") {
        handleFilterChange("budget", [
          filters.budget[0], // ค่าต่ำสุดไม่เปลี่ยน
          value === "" ? "" : Number(value),
        ]);
      }
    }}
    className="filter-budget-input"
  />
</div>
  </div>

</div>

<div className="filter-hr-line" />


      {/* ฟิลเตอร์ช่วงวันเดินทาง */}
   <div className="filter-section">
  <label className="filter-label">ช่วงวันเดินทาง</label>
  <div className="filter-input-box">
  <DatePicker
      selected={filters.startDate}
      onChange={(date) => handleFilterChange("startDate", date)}
      highlightDates={isTourDate} // กำหนดการเปรียบเทียบวันที่
      // กำหนด minDate เป็น null เพื่อให้สามารถเลือกวันที่ในอดีตได้
      minDate={null} 
      placeholderText="วันเดินทางไป"
      dateFormat="dd/MM/yyyy"
      className="filter-date-input"
    />
    <FaCalendarAlt className="filter-icon" />
  </div>
  <div className="filter-input-box">
  <DatePicker
      selected={filters.endDate}
      onChange={(date) => handleFilterChange("endDate", date)}
      // minDate สำหรับ endDate จะเป็น startDate หรือวันที่ปัจจุบัน ถ้าต้องการให้เลือกได้ย้อนหลัง
      minDate={filters.startDate || null} 
      placeholderText="วันเดินทางกลับ"
      dateFormat="dd/MM/yyyy"
      className="filter-date-input"
    />
    <FaCalendarAlt className="filter-icon"/>
  </div>
</div>


<div className="filter-hr-line" />


      {/* ฟิลเตอร์จำนวนวัน */}
      <div className="filter-section">
        <label className="filter-label">จำนวนวัน</label>
       
          {durations.map((duration, index) => (
            <label key={index} className="duration-label">
              <input
                type="checkbox"
                value={duration}
                checked={filters.duration.includes(duration)}
                onChange={() => handleDurationChange(duration)}
                 className="square"
              />
              {duration}
            </label>
          ))}
       
      </div>

      <div className="filter-hr-line" />

     

      {/* ฟิลเตอร์ทำเลที่ตั้ง */}
      <div className="filter-section">
  <label className="filter-label">ทำเลที่ตั้ง</label>
  <div className="location-label">
    {locations.map((location, index) => (
      <label key={index} className="duration-label">
        <input
          type="checkbox"
          value={location}
          checked={filters.location.includes(location)}
          onChange={() => handleLocationChange(location)}
          className="circle"
        />
        <span>{location}</span>
      </label>
    ))}
  </div>
</div>

    </div>
  );
};

export default FilterBox;


