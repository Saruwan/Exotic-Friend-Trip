import React, { useState, useEffect } from "react";


const BookingOptions = ({ bookingData, onDataChange }) => {
    const { selected_price_details, all_travel_dates } = bookingData;
    // รับข้อมูลจาก bookingdata
  const priceDetails = bookingData.price_details;
  
  const [totalPrice, setTotalPrice] = useState(bookingData.total_price || 0); // สร้าง state สำหรับราคารวม
  
  const FEE = 100; // ค่าธรรมเนียม
  const DISCOUNT_CODES = [
    { code: 'DISCOUNT50', discount: 50 },
    { code: 'DISCOUNT100', discount: 100 },
    { code: 'DISCOUNT200', discount: 200 }
  ];
  
  const [selectedDiscount, setSelectedDiscount] = useState(null); // ค่าเริ่มต้นของส่วนลด
  
  const handleDiscountChange = (event) => {
    const selectedCode = event.target.value;
    const discount = DISCOUNT_CODES.find(d => d.code === selectedCode);
    
    if (discount) {
      setSelectedDiscount(discount); // ตั้งค่าคส่วนลดที่เลือก
    }
  };
  const totalPriceWithDiscount = totalPrice + FEE - (selectedDiscount ? selectedDiscount.discount : 0);
  
  const taxRate = 0.07; // ภาษี 7%
  const taxAmount = totalPriceWithDiscount * taxRate;
  const totalPriceWithTax = totalPriceWithDiscount + taxAmount;
  
  
   // ตั้งค่าตัวแปรตามข้อมูลที่ได้จาก selected_price_details
   const [adultCount, setAdultCount] = useState(bookingData.adult_count || 0);
   const [childCount, setChildCount] = useState(bookingData.child_count || 0);
   const [infantCount, setInfantCount] = useState(bookingData.infant_count || 0);
  
   const [selectedDateRange, setSelectedDateRange] = useState(
    selected_price_details.start_date && selected_price_details.end_date
      ? { start_date: selected_price_details.start_date, end_date: selected_price_details.end_date }
      : null
  );
  const [roomPrices, setRoomPrices] = useState({
    adult: selected_price_details.roomPrices?.adult || 0,
    childWithBed: selected_price_details.roomPrices?.childWithBed || 0,
    infant: 0, 
  });
  
  const [selectedPriceId, setSelectedPriceId] = useState(selected_price_details.price_id || null);
  
  
    // บันทึกข้อมูลทั้งหมดใน state
    const [booking, setBooking] = useState({
      selectedDateRange,
      selectedRooms: [],
      totalPrice: 0,
      selectedPriceId,
    });
  
    // คำนวณข้อมูลใหม่ทุกครั้งเมื่อมีการเลือกวันที่ใหม่
    useEffect(() => {
      if (selectedDateRange) {
        // หา roomPrices จาก all_travel_dates ตามวันที่เลือก
        const selectedPrice = all_travel_dates.find(
          (dateInfo) =>
            `${dateInfo.start_date} - ${dateInfo.end_date}` ===
            `${selectedDateRange.start_date} - ${selectedDateRange.end_date}`
        );
  
        // ถ้าพบข้อมูลราคาก็อัปเดต roomPrices และ selectedPriceId
        if (selectedPrice) {
          setRoomPrices({
            adult: selectedPrice.roomPrices?.adult || 0,
            childWithBed: selectedPrice.roomPrices?.childWithBed || 0,
            infant: 0, 
          });
          setSelectedPriceId(selectedPrice.price_id); // ตั้งค่า price_id ที่ตรงกับวันที่เลือก
        }
      }
    }, [selectedDateRange, all_travel_dates]);
  
    // คำนวณราคาใหม่ทุกครั้งเมื่อข้อมูลเกี่ยวกับห้องหรือจำนวนผู้ใช้อัปเดต
    useEffect(() => {
      const selectedRooms = [
        adultCount >= 0 && {
          roomType: "ผู้ใหญ่",
          count: adultCount,
          price_per_person: roomPrices.adult,
          price: roomPrices.adult * adultCount,
          subText: "Over 18+",
        },
        childCount >= 0 && {
          roomType: "เด็ก",
          count: childCount,
          price_per_person: roomPrices.childWithBed,
          price: roomPrices.childWithBed * childCount,
          subText: "Under 12",
        },
        infantCount >= 0 && {
          roomType: "ทารก",
          count: infantCount,
          price_per_person: 0, // ราคาทารกเป็น 0
          price: roomPrices.infant * infantCount,
          subText: "Under 3",
        },
      ].filter(Boolean); // กรองข้อมูลที่ไม่ใช้
  
      // คำนวณราคารวม
      const calculatedTotalPrice = selectedRooms.reduce((total, room) => total + room.price, 0);
  
      // อัปเดต state booking
      const updatedBooking = {
        selectedDateRange,
        selectedRooms,
        totalPrice: calculatedTotalPrice,
        selectedPriceId, // ส่ง selectedPriceId กลับด้วย
      };
      setBooking(updatedBooking);
  
      // อัปเดตข้อมูลใน bookingData ผ่าน onDataChange
      if (onDataChange) {
        onDataChange(updatedBooking);
      }
    }, [selectedDateRange, adultCount, childCount, infantCount, roomPrices, selectedPriceId]);
  
    const handleDateRangeChange = (event) => {
      const selected = all_travel_dates.find(
        (dateInfo) => `${dateInfo.start_date} - ${dateInfo.end_date}` === event.target.value
      );
      setSelectedDateRange(selected);
    };
  
  
    
    // คำนวณห้องที่เลือกจาก price_details
    const selectedRooms = [
      priceDetails.adult.count >= 0 && {
        roomType: "ผู้ใหญ่",
        count: priceDetails.adult.count,
        price_per_person: priceDetails.adult.price_per_person,
        price: priceDetails.adult.price_per_person * priceDetails.adult.count,
      },
      priceDetails.child.count >= 0 && {
        roomType: "เด็ก",
        count: priceDetails.child.count,
        price_per_person: priceDetails.child.price_per_person,
        price: priceDetails.child.price_per_person * priceDetails.child.count,
      },
      priceDetails.infant.count >= 0 && {
        roomType: "ทารก",
        count: priceDetails.infant.count,
        price_per_person: 0, // ราคาทารกเป็น 0
        price: 0,
      },
    ].filter(Boolean); // Remove falsy values
  
    // คำนวณราคารวม
    const calculatedTotalPrice = selectedRooms.reduce((total, room) => total + room.price, 0);
  
    useEffect(() => {
      if (calculatedTotalPrice !== totalPrice) {
        console.log("Calculated Total Price:", calculatedTotalPrice);
        console.log("Total Price from Booking Data:", totalPrice);
      }
    }, [calculatedTotalPrice, totalPrice]);
  
  
  
    
    const handleIncrement = (roomType) => {
      const updatedRooms = booking.selectedRooms.map((room) => {
        if (room.roomType === roomType) {
          // เพิ่มจำนวนผู้ใหญ่ถ้ายังไม่เกินจำนวนที่นั่ง
          if (roomType === "ผู้ใหญ่" && room.count < bookingData.seat) {
            return { ...room, count: room.count + 1 };
          }
          // สำหรับห้องประเภทอื่น ๆ (เด็ก, ทารก) เพิ่มได้โดยไม่มีข้อจำกัด
          if (roomType !== "ผู้ใหญ่") {
            return { ...room, count: room.count + 1 };
          }
        }
        return room;
      });
      setBooking({ ...booking, selectedRooms: updatedRooms });
      calculateTotalPrice(updatedRooms);  // คำนวณราคาใหม่
    };
    
    const handleDecrement = (roomType) => {
      const updatedRooms = booking.selectedRooms.map((room) => {
        if (room.roomType === roomType) {
          // ลดจำนวนผู้ใหญ่ ถ้าผู้ใหญ่ยังไม่ต่ำกว่า 1
          if (roomType === "ผู้ใหญ่" && room.count > 1) {
            return { ...room, count: room.count - 1 };
          }
          // สำหรับห้องประเภทอื่น ๆ (เด็ก, ทารก) ลดได้ถ้ามีจำนวนมากกว่า 0
          if (roomType !== "ผู้ใหญ่" && room.count > 0) {
            return { ...room, count: room.count - 1 };
          }
        }
        return room;
      });
      setBooking({ ...booking, selectedRooms: updatedRooms });
      calculateTotalPrice(updatedRooms);  // คำนวณราคาใหม่
    };
    
    const calculateTotalPrice = (rooms) => {
      let total = 0;
    
      rooms.forEach((room) => {
        if (room.roomType === "ผู้ใหญ่") {
          total += room.count * room.price_per_person;
        } else if (room.roomType === "เด็ก") {
          total += room.count * room.price_per_person;
        } else if (room.roomType === "ทารก") {
          total += room.count * room.price_per_person;
        }
      });
    
      setTotalPrice(total);  // อัพเดตค่าราคารวม
    };
    
  return (
    <div>
      {/* กรอบที่ 2: เลือกวันเดินทางและจำนวนคน */}
<div style={styles.box}>
  {/* กรอบเลือกวันเดินทาง */}
  <div style={styles.dateBox}>
  <p style={styles.dateLabel}>เลือกวันเดินทาง</p>
              <select
              style={styles.dateDropdown}
        onChange={handleDateRangeChange}
        value={selectedDateRange ? `${selectedDateRange.start_date} - ${selectedDateRange.end_date}` : ''}
      >
        {all_travel_dates.map((dateInfo, index) => (
          <option key={index} value={`${dateInfo.start_date} - ${dateInfo.end_date}`}>
            {dateInfo.start_date} - {dateInfo.end_date}
          </option>
        ))}
      </select>

            
            </div>

           
             {/* แสดงรายละเอียดราคา */}
      {booking.selectedRooms.map((room, index) => (
             
  <div style={styles.personBox}  key={index}>
    <div style={styles.personInfo}>
      <p><strong>{room.roomType}</strong> <span style={styles.subText}>{room.subText}</span></p>
      <p style={styles.price}>฿{room.price_per_person.toLocaleString()}  </p>
    </div>
    <div style={styles.counter}>
      <button style={styles.counterButton} onClick={() => handleDecrement(room.roomType)}>-</button>
      <span style={styles.counterValue}>{room.count} </span>
      <button style={styles.counterButton}  onClick={() => handleIncrement(room.roomType)}>+</button>
    </div>
  </div>
  
              
               
              ))}
            <hr style={styles.underline} />
  {/* เพิ่มส่วนโปรโมชัน */}
  <div style={styles.promotionSection}>
            <label style={styles.promotionLabel}>โปรโมชั่น</label>
            <div style={styles.searchContainer}>
                  <select onChange={handleDiscountChange}>
                  <option value="">เลือกส่วนลด</option>
                  {DISCOUNT_CODES.map((discount) => (
                    <option key={discount.code} value={discount.code}>
                      {discount.code}
                    </option>
                  ))}
                </select>
            
            </div>
          </div>
{/* ราคารวม */}
<div style={styles.totalBox}>
<div style={styles.totalText}>
  <p >ยอดรวม</p>
  <p >฿ {totalPrice.toLocaleString()}</p>
              </div>
               {/* เพิ่มข้อมูลภาษี ค่าธรรมเนียม ส่วนลด */}
            <div style={styles.text}>
              <span >ภาษี(7%)</span>
              <span>฿  {taxAmount.toLocaleString()}</span>
            </div>
            <div style={styles.text}>
              <span >ค่าธรรมเนียมการจอง</span>
              <span>฿ {FEE}</span>
            </div>
            <div style={styles.discountPrice}>
            <span >{selectedDiscount ? selectedDiscount.code : 'ส่วนลด'}</span>
<span >- ฿ {selectedDiscount ? selectedDiscount.discount : '0'}</span>

            </div>
            <hr style={styles.underline} />
            <div style={styles.totalText}>
                <span>จำนวนเงินที่ต้องชำระ</span>
                <span>฿ {totalPriceWithTax.toLocaleString()}</span>
                </div>
              
            </div>
            <button style={styles.bookButton}onClick={() => handleBooking(tourInfo.id)}>จองเลย</button>
            </div>
            
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Prompt', sans-serif",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#fff",
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
  mainContent: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  leftColumn: {
    flex: 1,
    marginTop: "-20px",
  },
  };
export default BookingOptions;
