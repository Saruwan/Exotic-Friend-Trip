import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


function Step1({ travelDates, pricing, period, endDate, onTotalAdultsChange,onNext, initialRoomCounts, initialDate }) {
  // ตั้งค่าช่วงเวลาเริ่มต้นตาม period และ endDate ที่ส่งมา
  const initialSelectedDate = travelDates.find(
    (dateInfo) => dateInfo.start_date === period && dateInfo.end_date === endDate
  );

  const [selectedDateRange, setSelectedDateRange] = useState(initialDate || initialSelectedDate);


  const handleDateRangeChange = (event) => {
    const selected = travelDates.find(
      (dateInfo) => `${dateInfo.start_date} - ${dateInfo.end_date}` === event.target.value
    );
    setSelectedDateRange(selected);
  };

  const [singleRoom, setSingleRoom] = useState(initialRoomCounts?.singleRoom || 0);
  const [childWithBed, setChildWithBed] = useState(initialRoomCounts?.childWithBed || 0);
  const [childWithoutBed, setChildWithoutBed] = useState(initialRoomCounts?.childWithoutBed || 0);

  
  const [totalAdults, setTotalAdults] = useState(0);
    
 
  const calculateTotal = () => {
    return (
      singleRoom * selectedDateRange.roomPrices.singleRoom +
     childWithBed * selectedDateRange.roomPrices.childWithBed +
      childWithoutBed * selectedDateRange.roomPrices.childWithoutBed
    );
  };

  
  const handleInputChange = (setter, value) => {
    const number = Math.max(0, parseInt(value) || 0);
    setter(number);
  };

  

  useEffect(() => {
    const adultsCount = singleRoom ;
    setTotalAdults(adultsCount);
    if (onTotalAdultsChange) {
      onTotalAdultsChange(adultsCount); 
    }

    // คำนวณข้อมูลห้องที่เลือก
    const selectedRooms = [];
    if (singleRoom > 0) selectedRooms.push({ roomType: "ผู้ใหญ่", count: singleRoom, price: singleRoom * selectedDateRange.roomPrices.singleRoom });
    if (childWithBed > 0) selectedRooms.push({ roomType: "เด็ก", count: childWithBed, price: childWithBed * selectedDateRange.roomPrices.childWithBed });
    if (childWithoutBed > 0) selectedRooms.push({ roomType: "ทารก", count: childWithoutBed, price: childWithoutBed * selectedDateRange.roomPrices.childWithoutBed });
  
    const totalPrice = selectedRooms.reduce((total, room) => total + room.price, 0);
  
    // ส่งข้อมูลกลับไปที่คอมโพเนนต์หลัก (TourBooking)
    onNext({
      selectedDateRange,
      selectedRooms,
      totalPrice,
      counts: {
        singleRoom,
       
        childWithBed,
        childWithoutBed,
      },
    });
  }, [singleRoom, childWithBed, childWithoutBed, selectedDateRange, onNext, onTotalAdultsChange]);

  
  
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "20px auto",
      padding: "20px",
      border: "2px solid #003580",
      borderRadius: "10px",
      backgroundColor: "#fff",
      fontFamily: "Arial, sans-serif",
      color: "#003580",
    },
    pageContainer: {
      maxWidth: "900px",
      margin: "20px auto",
      fontFamily: "Arial, sans-serif",
      color: "#003580",
    },
    header: {
      textAlign: "left",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    selectBox: {
      marginLeft: "0", // ไม่มีระยะห่างทางด้านซ้าย
      padding: "5px",
      borderRadius: "5px", // ขอบมน
      border: "2px solid #003580", // ขอบสีน้ำเงิน
      color: "#003580", // สีตัวอักษรน้ำเงิน
      width: "auto", // ปรับขนาดให้เหมาะสม
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "10px",
      marginTop: "-15px",
    },
    tableHead: {
      backgroundColor: "#fff",
      borderBottom: "2px solid #003580", // เพิ่มเส้นขอบล่าง
      width: "100%", // ครอบคลุมพื้นที่ทั้งหมด
    },
    tableCell: {
      border: "none", // ลบเส้นทั้งหมดก่อน
    borderBottom: "1px solid #ddd", // เพิ่มแค่เส้นล่าง
      textAlign: "center",
      padding: "10px",
    },
    input: {
      width: "50px", // ลดความกว้างของช่อง
      padding: "5px", // ลดขนาด padding
      textAlign: "center", // จัดกลาง
      fontSize: "14px", // ขนาดตัวอักษรเล็กลง
    },
    summaryRow: {
      backgroundColor: "#003580",
      color: "#ffffff",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      borderRadius: "5px",
    },
    summaryText: {
      margin: 0,
    },
    dateSelector: {
      textAlign: "left", // ให้ข้อความจัดเรียงทางด้านซ้าย
      marginLeft: "0", // ไม่มีระยะห่างทางด้านซ้าย
      display: "flex", // ใช้ flexbox เพื่อจัดตำแหน่ง
      flexDirection: "column", // จัดให้ label และ select อยู่ในคอลัมน์เดียว
      alignItems: "flex-start", // ให้จัดซ้ายทั้งหมด
    },
    label: {

      display: "block", // ทำให้ label อยู่คนละบรรทัดกับ select box
      marginBottom: "5px", // เว้นระยะห่างระหว่าง label และ select box
      fontWeight: "bold", // ทำให้ข้อความใน label เป็นตัวหนา
    },
    icon: {
      marginRight: "10px",
      fontSize: "20px",
      color: "#19a7ce",
      verticalAlign: "middle",  // ทำให้ไอคอนอยู่กลางบรรทัด
      marginTop: "1px",  // ขยับไอคอนลงมา
    },
    travelInfo: {
      marginTop: "20px",
      fontSize: "16px",
    },
    travelText: {
      fontSize: "18px",
      marginTop: "5px",
    },
    travelText: {
      fontSize: "16px",
      marginTop: "-5px", // ลดระยะห่างจากด้านบน
    },
    subText: {
      fontSize: "14px",
      color: "#808080",  // สีเทา
      display: "block",
      marginTop: "5px", // ลดระยะห่างจากด้านบน
      marginLeft: "30px",  // เพิ่มระยะห่างทางด้านซ้าย
    },
    hr: {
      border: "none",
      borderTop: "1px solid #d3d3d3", // สีเทา
      margin: "20px 0", // ระยะห่างบนและล่าง
    },

  };
    

  return (
      <div style={styles.pageContainer}>
        {/* ส่วนหัวข้อ "ขั้นตอนที่ 1" */}
        <h1 style={styles.header}>ขั้นตอนที่ 1 :  <span style={{ fontWeight: "normal" }}>ระบุจำนวนผู้เดินทางและห้องพัก</span></h1>
  
         {/* เส้นแนวนอนคั่น */}
      <hr style={styles.hr} />


        {/* ส่วนเลือกวันที่เดินทาง */}
        <div style={styles.dateSelector}>
        <label htmlFor="travelDate" style={styles.label}>เลือกวันเดินทาง :</label>
        <select
          onChange={handleDateRangeChange}
          value={selectedDateRange ? `${selectedDateRange.start_date} - ${selectedDateRange.end_date}` : ""}
          style={styles.selectBox}
        >
          {travelDates.map((dateInfo, index) => (
            <option key={index} value={`${dateInfo.start_date} - ${dateInfo.end_date}`}>
              {dateInfo.start_date} - {dateInfo.end_date}
            </option>
          ))}
        </select>
      </div>

        {/* เพิ่มโค้ดนี้ตรงนี้ */}
        <div style={styles.travelInfo}>
        <p style={{ fontWeight: "bold", textAlign: "left" }}>ระบุจำนวนผู้เดินทาง :</p>
        <p style={{ ...styles.travelText, textAlign: "left", color: "#19a7ce" }}>
          <FontAwesomeIcon icon={faInfoCircle} style={styles.icon} />
          ในแต่ละห้อง ผู้ใหญ่และเด็กรวมกันได้ไม่เกิน 3 คน
          <span style={styles.subText}>
            (หากคุณมีทารกนอนด้วย สามารถนอนรวมในห้องเดียวกันได้)
          </span>
        </p>
      </div>



      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.tableCell}>จำนวน</th>
              <th style={{ ...styles.tableCell, textAlign: "left" }}>ประเภท</th>
              <th style={styles.tableCell}>ราคาต่อคน</th>
              <th style={styles.tableCell}>ราคารวม</th>
            </tr>
          </thead>
          <tbody>


            <tr>
              <td style={styles.tableCell}>
                <input
                  type="number"
                  value={singleRoom}
                  onChange={(e) => handleInputChange(setSingleRoom, e.target.value)}
                  min="0"
                  style={styles.input}
                />
              </td>
              <td style={{ ...styles.tableCell, textAlign: "left" }}>ผู้ใหญ่</td>
              <td style={styles.tableCell}>
                ฿ {selectedDateRange.roomPrices.singleRoom.toLocaleString()}
              </td>
              <td style={styles.tableCell}>
                ฿ {(singleRoom * selectedDateRange.roomPrices.singleRoom).toLocaleString()}
              </td>
            </tr>


          <tr>
            <td style={styles.tableCell}>
              <input
                type="number"
                value={childWithBed}
                onChange={(e) =>
                  handleInputChange(setChildWithBed, e.target.value)
                }
                min="0"
                style={styles.input}
              />
            </td>
            <td style={{...styles.tableCell, textAlign: "left"}}>เด็ก</td>
            <td style={styles.tableCell}>
              ฿ {selectedDateRange.roomPrices.childWithBed.toLocaleString()}
            </td>
            <td style={styles.tableCell}>
              ฿ {(childWithBed * selectedDateRange.roomPrices.childWithBed).toLocaleString()}
            </td>
          </tr>


          <tr>
            <td style={styles.tableCell}>
              <input
                type="number"
                value={childWithoutBed}
                onChange={(e) =>
                  handleInputChange(setChildWithoutBed, e.target.value)
                }
                min="0"
                style={styles.input}
              />
            </td>
            <td style={{...styles.tableCell, textAlign: "left"}}>ทารก</td>
            <td style={styles.tableCell}>
              ฿ {selectedDateRange.roomPrices.childWithoutBed.toLocaleString()}
            </td>
            <td style={styles.tableCell}>
              ฿ {(childWithoutBed * selectedDateRange.roomPrices.childWithoutBed).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      {totalAdults === 0 && (
  <p style={{ color: "red" }}>
    *** กรุณาเลือกผู้ใหญ่ร่วมทริปอย่างน้อย 1 คน ***
  </p>
)}

      <div style={styles.summaryRow}>
        <p style={styles.summaryText}>
          ผู้ใหญ่: {singleRoom} คน, เด็ก:{" "} {childWithBed} คน, ทารก:{" "} {childWithoutBed} คน
        </p>
        <p style={styles.summaryText}>รวม: ฿ {calculateTotal().toLocaleString()}</p>
      </div>
    </div>
    </div>
  );
}

export default Step1;
