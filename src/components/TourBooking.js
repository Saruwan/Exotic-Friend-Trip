import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { FaMapMarked } from "react-icons/fa";
import "./TourBooking.css"
function TourBooking() {
  const [currentStep, setCurrentStep] = useState(2);
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // รับ id จาก URL
  const navigate = useNavigate();
  const location = useLocation();

  const [idTourCategory, setIdTourCategory] = useState(null);

  const [step2Data, setStep2Data] = useState({});

  const handleStep2DataChange = (data) => {
    if (JSON.stringify(step2Data) !== JSON.stringify(data)) {
      setStep2Data(data);
    }
    console.log("ข้อมูลที่ได้รับจาก Step2:", data);
  };
  

  useEffect(() => {
    if (step2Data && Object.keys(step2Data).length > 0) {
      // หากมีการเปลี่ยนแปลงข้อมูลจาก Step2
      localStorage.setItem('step2Data', JSON.stringify(step2Data));
      // ทำการอัปเดตข้อมูลหรือดำเนินการอื่นๆ ที่ต้องการ
    }
  }, [step2Data]);  // รันเมื่อ step2Data เปลี่ยนแปลง
  
  // โหลดข้อมูลจาก localStorage เมื่อ component ถูกโหลดครั้งแรก
useEffect(() => {
  const storedData = localStorage.getItem('step2Data');
  if (storedData) {
    setStep2Data(JSON.parse(storedData));
  }
}, []);


  // ตรวจสอบข้อมูลที่ได้รับจาก location.state
  const bookingData = location.state;

  useEffect(() => {
    // เช็คว่า location.state หรือ id เปลี่ยนแปลงหรือไม่
    if (bookingData && id) {
      console.log("Booking Data from location:", bookingData);
      console.log("ID from useParams:", id);
      console.log("State from location:", location.state);
  
      // ให้ทำการตั้งค่าหรือใช้งานข้อมูลนี้ในที่นี้
    }
  }, [bookingData, id, location.state]); // ทำงานเมื่อข้อมูลเหล่านี้เปลี่ยนแปลง
  
  const { selected_price_details, all_travel_dates } = bookingData;
  // รับข้อมูลจาก bookingdata
const priceDetails = bookingData.price_details;

const [totalPrice, setTotalPrice] = useState(bookingData.total_price || 0); // สร้าง state สำหรับราคารวม

const [isPaymentSaved, setIsPaymentSaved] = useState(false);

  const handlePaymentSaved = (status) => {
    setIsPaymentSaved(status); // รับค่าจาก Step3 แล้วอัปเดต state
  };

useEffect(() => {
  const fetchTourDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/travel_api?id=${id}`);
      const data = await response.json();

      // สมมติว่า API ส่งข้อมูลที่ต้องการ
      const tour = data.find((item) => item.idWebsite_TravelCenterDatabase === id);
      if (tour) {
        setTourDetails({
          id: tour.idWebsite_TravelCenterDatabase,
          title: tour.tour_excursion_name,
          duration: tour.excursion_type,
          description: tour.description,
          tourCode: tour.idWebsite_TravelCenterDatabase,
          location: tour.id_province || "Unknown", // ใช้ "Unknown" ถ้า location ไม่มีค่า
          image: tour.profile?.imageURL || "https://via.placeholder.com/150", // รูปตัวอย่าง
          category: tour.id_tour_category
        });

        setIdTourCategory(tour.id_tour_category);

      } else {
        console.error("ไม่พบข้อมูลทัวร์สำหรับ ID นี้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTourDetails();
}, [id]);

const FEE = 100; // ค่าธรรมเนียม
const DISCOUNT_CODES = [
  { code: "DISCOUNT50", discount: 50, category: [1, 16, 17] }, // ใช้ได้กับหมวด 1, 3, 5
  { code: "DISCOUNT100", discount: 100, category: [16] }, // ใช้ได้กับหมวด 2, 4
  { code: "DISCOUNT200", discount: 200, category: [2, 28, 17] } // ใช้ได้กับหมวด 1, 2, 3
];
const [discountCode, setDiscountCode] = useState(""); // รหัสที่ผู้ใช้พิมพ์
const [suggestions, setSuggestions] = useState([]); // รายการคำแนะนำโค้ด
const [errorMessage, setErrorMessage] = useState(""); // ข้อความแจ้งเตือน
const [selectedDiscount, setSelectedDiscount] = useState(null); // ส่วนลดที่เลือก

const handleDiscountChange = (event) => {
  const inputValue = event.target.value.toUpperCase();
  setDiscountCode(inputValue);

  if (inputValue === "") {
    setSuggestions([]);
    setErrorMessage("");
    setSelectedDiscount(null);
    return;
  }

  // ค้นหาโค้ดที่ตรงกัน
  const matchingCodes = DISCOUNT_CODES.filter((d) =>
    d.code.startsWith(inputValue) && d.category.includes(Number(idTourCategory))
  );

  if (matchingCodes.length > 0) {
    setSuggestions(matchingCodes);
    setErrorMessage("");
  } else {
    setSuggestions([]);
    setErrorMessage("ไม่มีโค้ดส่วนลดที่ใช้ได้");
    setSelectedDiscount(null);
  }
};

// เมื่อเลือกโค้ดจากคำแนะนำ
const handleSelectSuggestion = (code) => {
  const discount = DISCOUNT_CODES.find((d) => d.code === code && d.category.includes(Number(idTourCategory)));
  if (discount) {
    setDiscountCode(code);
    setSelectedDiscount(discount);
    setSuggestions([]);
    setErrorMessage("");
  }
};


console.log("idTourCategory:", idTourCategory);
console.log("selectedDiscount.category:", selectedDiscount?.category);

const isCodeValidForCategory =
  selectedDiscount &&
  idTourCategory !== null &&
  idTourCategory !== undefined &&
  selectedDiscount.category.includes(Number(idTourCategory));


const totalPriceWithDiscount =
selectedDiscount && isCodeValidForCategory
  ? totalPrice + FEE - selectedDiscount.discount
  : totalPrice + FEE;

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
  }, [selectedDateRange, all_travel_dates, ]);

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
        if (roomType === "ผู้ใหญ่") {
          if (room.count < bookingData.seat) {
            setAdultCount((prev) => prev + 1);
            return { ...room, count: room.count + 1 };
          }
        }
        if (roomType === "เด็ก") setChildCount((prev) => prev + 1);
        if (roomType === "ทารก") setInfantCount((prev) => prev + 1);
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
        if (roomType === "ผู้ใหญ่" && adultCount > 1) setAdultCount((prev) => prev - 1);
        if (roomType === "เด็ก" && childCount > 0) setChildCount((prev) => prev - 1);
        if (roomType === "ทารก" && infantCount > 0) setInfantCount((prev) => prev - 1);
      
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
  
  const updateBookingData = (updatedValues) => {
    const updatedBookingData = {
      ...bookingData,
      adult_count: adultCount,
      child_count: childCount,
      infant_count: infantCount,
      total_price: totalPrice, // อัปเดตราคาด้วย
      selected_price_details: {
        ...bookingData.selected_price_details,
        roomPrices,
      },
    };
  
  };
  useEffect(() => {
    updateBookingData();
  }, [adultCount, childCount, infantCount, totalPrice]);
  
  

  // ฟังก์ชันการไปยังขั้นตอนถัดไป
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
 // ฟังก์ชันย้อนกลับขั้นตอน
  const prevStep = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1); // ย้อนกลับจากขั้นตอน 3 ไป 2 หรือจาก 4 ไป 3
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <Step2
          nextStep={nextStep}
            onDataChange={(data) => setStep2Data(data)}
            initialValues={step2Data}
            
          />
        );
      case 3:
        return <Step3 step2Data={step2Data}
        onPaymentSaved={handlePaymentSaved} />;
      case 4:
        return <Step4 step2Data={step2Data} />;
      default:
        return null;
    }
  };

  
  if (loading) {
    return <p>Loading...</p>; // แสดงข้อความระหว่างโหลดข้อมูล
  }

  if (!tourDetails) {
    return <p>ไม่พบข้อมูลสำหรับ ID: {id}</p>; // แสดงข้อความถ้าไม่มีข้อมูล
  }

  return (
    <div className="booking-container">
        
      {/* กรอบข้อมูลทัวร์ */}
      <div className="booking-tour-card">
        <div className="booking-card-left">
          <img src={tourDetails.image} alt="Tour Poster" className="booking-tour-image" />
        </div>
        <div className="booking-card-right">
          <h2 className="booking-tour-title">{tourDetails.title}</h2>
          
          <p className="booking-tour-places"> <FaMapMarked className="booking-icons" />{tourDetails.location}</p>
          <p className="booking-tour-location">
            <strong>ระยะเวลา </strong> <span className="booking-highlighted-text">{tourDetails.duration}</span>
          </p>
          <p className="booking-tour-location">
            <strong>รหัสทัวร์ </strong> <span className="booking-highlighted-text">{tourDetails.tourCode}</span>
          </p>
         
        </div>
       
      </div>

      
    
      <div className="booking-steps">
  {/* ขั้นตอนที่ 1 ที่สามารถกดกลับไปได้ */}
  <div
    className="booking-step"
    onClick={() => navigate(-1)} // ถ้ากด ให้ออกไปหน้าก่อนหน้า
  >
    <div className="booking-disabled-circle">1</div>
    <p className="booking-disabled-step-text">เลือกทัวร์</p>
  </div>

  <div className="booking-line"></div>

  {Array.from({ length: 3 }, (_, index) => {
    const stepNumber = index + 2;
    return (
      <React.Fragment key={index}>
        <div
            className={`booking-step ${currentStep === stepNumber ? "booking-active-step" : "booking-inactive-step"}`}
          onClick={() => {
            if (currentStep > stepNumber) {
              setCurrentStep(stepNumber);
            }
          }}
        >
         <div
  className={`booking-circle ${
    currentStep === stepNumber
      ? "active"
      : currentStep > stepNumber
      ? "completed"
      : ""
  }`}
>
  {stepNumber}
</div>

          <p className="booking-step-text">
            {index === 0 ? "กรอกข้อมูลผู้จอง" : index === 1 ? "ชำระเงิน" : "สมบูรณ์"}
          </p>
        </div>
        {index < 2 && <div className="booking-line"></div>}
      </React.Fragment>
    );
  })}
</div>


{/* ส่วนแสดงชื่อขั้นตอน */}
{currentStep === 2 && (
  <>
    <h1 className="booking-header">
      ขั้นตอนที่ 2 :{" "}
      <span>
        ตรวจสอบรายละเอียดและกรอกข้อมูลผู้จอง
      </span>
    </h1>
    <div className="booking-hr" />
  </>
)}

{currentStep === 3 && (
  <>
    <h1 className="booking-header">
      ขั้นตอนที่ 3 :{" "}
      <span>
        ชำระเงิน
      </span>
    </h1>
    <div className="booking-hr" />
  </>
)}

{currentStep === 4 && (
  <>
    <h1 className="booking-header">
      ขั้นตอนที่ 4 :{" "}
      <span>
       การจองเสร็จสมบูรณ์
      </span>
    </h1>
    <div className="booking-hr" />
  </>
)}


<div className="booking-page-container">
       
 {/* เงื่อนไขในการแสดงขั้นตอน */}
 {currentStep === 4 ? (
    // ขั้นตอนที่ 4 ให้แสดงแค่ข้อมูลตรงกลาง
    <div className="boooking-centered-content">
      {renderStep()}
    </div>
  ) : (
       
       <div className="booking-main-content">
       <div className="booking-right-column">
       {renderStep()}
       </div>

<div className="booking-left-column">
          <div className="booking-right-section">
         
 {/* กรอบที่ 2: เลือกวันเดินทางและจำนวนคน */}
<div className="booking-box">
  {/* กรอบเลือกวันเดินทาง */}
  <div className="booking-date-box">
  <p className="booking-date-label">เลือกวันเดินทาง</p>
              <select
              className="booking-date-dropdown"
              disabled={isPaymentSaved}
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
             
  <div className="booking-person-box"  key={index}>
    <div className="booking-person-info">
      <p><strong>{room.roomType}</strong> <span className="booking-sub-text">{room.subText}</span></p>
      <p className="booking-price">฿{room.price_per_person.toLocaleString()}  </p>
    </div>
    <div className="booking-counter">
      <button className="booking-counter-button" onClick={() => handleDecrement(room.roomType)} disabled={isPaymentSaved}>-</button>
      <span className="booking-counter-value">{room.count} </span>
      <button className="booking-counter-button"  onClick={() => handleIncrement(room.roomType)} disabled={isPaymentSaved}>+</button>
    </div>
  </div>
  
              
               
              ))}
            <div className="booking-underline" />
  {/* เพิ่มส่วนโปรโมชัน */}
  <div className="booking-promotion-section">
            <label className="booking-promotion-label">โปรโมชั่น</label>
            <div className="booking-search-container">
            <input
      type="text"
      value={discountCode}
      onChange={handleDiscountChange}
      placeholder="ใช้ส่วนลดหรือใส่รหัสโปรโมชั่น"
     className="booking-search-input"
      disabled={isPaymentSaved}
    />
   <i className="fa fa-search booking-search-icon"></i> {/* ไอคอนค้นหา */}

 </div>
  {/* แสดงคำแนะนำ */}
{suggestions.length > 0 && (
  <ul>
   {suggestions.map((s, index) => {
    const isValid = s.category.includes(Number(idTourCategory)); // ตรวจสอบว่าหมวดหมู่ตรงกัน
     return (
      <li
      key={index}
      onClick={() => isValid && handleSelectSuggestion(s.code)}
      className={`booking-suggestion-item ${isValid ? 'booking-valid' : 'booking-disabled'}`}
      >
        <span>{s.code}</span>
        <span>฿ {s.discount}</span>
      </li>
       );
   })}
  </ul>
)}


    {/* แสดงข้อความแจ้งเตือน */}
    {errorMessage && (
      <p>{errorMessage}</p>
    )}

            
           
          </div>
{/* ราคารวม */}
<div className="booking-total-box">
<div className="booking-total-text">
  <p >ยอดรวม</p>
  <p >฿ {totalPrice.toLocaleString()}</p>
              </div>
               {/* เพิ่มข้อมูลภาษี ค่าธรรมเนียม ส่วนลด */}
            <div className="booking-text">
              <span >ภาษี(7%)</span>
              <span>฿  {taxAmount.toLocaleString()}</span>
            </div>
            <div className="booking-text">
              <span >ค่าธรรมเนียมการจอง</span>
              <span>฿ {FEE}</span>
            </div>
            <div className="booking-discount-price">
            <span >{selectedDiscount ? selectedDiscount.code : 'ส่วนลด'}</span>
<span >- ฿ {selectedDiscount ? selectedDiscount.discount : '0'}</span>

            </div>
            <div className="booking-underline" />
            <div className="booking-total-text">
                <span>จำนวนเงินที่ต้องชำระ</span>
                <span>฿ {totalPriceWithTax.toLocaleString()}</span>
                </div>
              
            </div>
          
            {/* ปุ่มกดต่อไป */}
      <button
       className="booking-book-button" 
       onClick={nextStep}
        disabled={
          (currentStep === 2 && !step2Data.isCheckboxChecked) || // เช็คเงื่อนไขใน Step2
          (currentStep === 3 && !isPaymentSaved) // เช็คเงื่อนไขใน Step3
        }
      >
        {currentStep === 3 && isPaymentSaved ? "เสร็จสิ้นการจอง" : "จองเลย"}
      </button>
            </div>
            
          </div>
          </div>
          </div>
           )}
          </div>
       


<div className="booking-button-container">

  {currentStep === 2 && (
    
    <>
     
      
    </>
  )}

{currentStep === 3 && (
    <>
     
    </>
  )}


  {currentStep === 4 && (
     <>
     
    <button
      className="booking-next-button"
      onClick={() => navigate("/")} // กลับไปหน้าแรก
      
    >
     กลับหน้าหลัก
    </button>
    </>
  )}
</div>
</div>
  );
}

export default TourBooking;
