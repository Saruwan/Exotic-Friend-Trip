import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import "./RoomSelection.css"; // นำเข้า CSS

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="date-input-container" onClick={onClick} ref={ref}>
    <input value={value} placeholder={placeholder} className="date-input" readOnly />
    <FaCalendarAlt className="date-icon" />
  </div>
));

const SearchBar = () => {
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="search-bar-container">
        <input type="text" placeholder="ค้นหาทัวร์ที่คุณสนใจ" className="search-input" />

        {/* DatePicker จะถูกซ่อนโดย CSS เมื่อหน้าจอเล็ก */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          customInput={<CustomDateInput placeholder="เลือกวันที่เช็คอิน" />}
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          customInput={<CustomDateInput placeholder="เลือกวันที่เช็คเอาท์" />}
        />

        <div className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span>{`ผู้ใหญ่ ${adultCount} คน, เด็ก ${childCount}, ทารก ${infantCount}`}</span>
  <span>▼</span>
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <div className="counter-row">
                <span>ผู้ใหญ่</span>
                <div>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setAdultCount(Math.max(1, adultCount - 1)); }}>-</button>
                  <span style={{ margin: "0 10px" }}>{adultCount}</span>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setAdultCount(adultCount + 1); }}>+</button>
                </div>
              </div>

              <div className="counter-row">
                <span>เด็ก</span>
                <div>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setChildCount(Math.max(0, childCount - 1)); }}>-</button>
                  <span style={{ margin: "0 10px" }}>{childCount}</span>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setChildCount(childCount + 1); }}>+</button>
                </div>
              </div>

              <div className="counter-row">
                <span>ทารก</span>
                <div>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setInfantCount(Math.max(0, infantCount - 1)); }}>-</button>
                  <span style={{ margin: "0 10px" }}>{infantCount}</span>
                  <button className="counter-button" onClick={(e) => { e.stopPropagation(); setInfantCount(infantCount + 1); }}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="search-button">ค้นหา</button>
      </div>
    </div>
  );
};

export default SearchBar;
