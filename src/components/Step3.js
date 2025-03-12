import React, { useState, useEffect } from 'react';
import "./Step3.css"
function Step3({step2Data,  onPaymentSaved }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
  const [uploadedSlip, setUploadedSlip] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown

  const { selectedDateRange, selectedRooms, totalPrice, roomCounts } = step2Data;

  useEffect(() => {
    console.log(step2Data); // Logs step2Data whenever it changes or when the component mounts
  }, [step2Data]);

  
  const [issuerBank, setIssuerBank] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [invalidAttempt, setInvalidAttempt] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    if (isSaved && method !== selectedPaymentMethod) {
      // ถ้าบันทึกแล้ว และพยายามกดอันอื่น → แสดงขอบแดงเตือน
      setInvalidAttempt(true);
      return;
    }
  
    setInvalidAttempt(false); // เคลียร์ขอบแดงเมื่อเลือกอันที่ถูกต้อง
  
    if (openDropdown === method) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(method);
    }
  
    setSelectedPaymentMethod(method);
    setIsPaymentMethodSelected(true);
  };
  
  useEffect(() => {
    if (invalidAttempt) {
      // ลบขอบแดงหลังจาก 0.5 วินาที
      const timer = setTimeout(() => setInvalidAttempt(false), 500);
      return () => clearTimeout(timer);
    }
  }, [invalidAttempt]);
  

 const handleBankSelect = (bank) => {
  // ถ้ามีการบันทึกแล้วและเลือกธนาคารเดิม ก็จะไม่ทำอะไร
  if (isSaved && selectedBank === bank) {
    return;
  }

  // ถ้าธนาคารเดียวกันถูกเลือก และยังไม่ได้บันทึก ก็ลบการเลือก
  if (selectedBank === bank) {
    setSelectedBank(null);
    setIsSaved(false); // กำหนด isSaved เป็น false หลังจากลบการเลือก
  } else {
    setSelectedBank(bank); // เลือกธนาคารใหม่
    setIsSaved(false); // รีเซ็ต isSaved เมื่อเปลี่ยนธนาคาร
  }
};

  

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    onPaymentSaved(isSaved); // ส่งค่ากลับไปยัง TourBooking ทุกครั้งที่ isSaved เปลี่ยนแปลง
  }, [isSaved, onPaymentSaved]);

  const handleSave = () => {
    if (selectedPaymentMethod === 'Credit and Debit') {
      if (issuerBank && cardHolderName && cardNumber && expiryMonth && expiryYear && cvv) {
        setIsSaved(true); // Only save if all required fields for Credit and Debit are filled
      } else {
        setIsSaved(false); // Do not save if any required field is missing
      }
    } else if (isPaymentMethodSelected && uploadedSlip) {
      setIsSaved(true); // Set isSaved to true only if a payment method is selected and a slip is uploaded
    } else {
      setIsSaved(false); // Keep isSaved false if any required fields are missing
    }
  };
  

  const handleFileUpload = (e) => {
    setUploadedSlip(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setUploadedSlip(null); // ล้างไฟล์ที่อัพโหลด
    setSelectedPaymentMethod(null); // ล้างวิธีการชำระเงินที่เลือก
    setIsPaymentMethodSelected(false); // ยกเลิกสถานะการเลือกชำระเงิน
    setSelectedBank(null); // ล้างธนาคารที่เลือก
    setIsSaved(false); // ยกเลิกสถานะการบันทึก
    // รีเซ็ตข้อมูลบัตร
    setIssuerBank(''); 
    setCardHolderName('');
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
   
  };
  
  
const handleInputChange = (e, setter) => {
  setter(e.target.value);
  setIsSaved(false); // รีเซ็ต isSaved ทุกครั้งที่ข้อมูลถูกแก้ไข
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  // Handle form submission (e.g., sending data to the server)
};

 // ข้อมูลธนาคาร
 const bankDetails = {
  'ธนาคาร 1': { name: 'ธนาคารกสิกรไทย', logo: 'https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png', accountName: 'Kasikorn Bank (KBANK)', accountNo: '123333321212', branch: 'กรุงเทพฯ' },
  'ธนาคาร 2': { name: 'ธนาคารกรุงศรีอยุธยา', logo: 'https://i.pinimg.com/736x/ed/80/c6/ed80c67f6f6b484e3a09c85801a5e3c2.jpg', accountName: 'บัญชีกรุงศรี', accountNo: '2211002222', branch: 'สยาม' },
  'ธนาคาร 3': { name: 'ธนาคารกรุงไทย', logo: 'https://www.kanjanabaramee.org/wp-content/uploads/2017/07/logo_ktb1.png', accountName: 'ออมสิน', accountNo: '333845212333', branch: 'ปทุมธานี' },
  'ธนาคาร 4': { name: 'ธนาคารกรุงเทพ', logo: 'https://f.ptcdn.info/801/022/000/1409170288-b60f8c1e0e-o.png', accountName: 'บัญชีกรุงเทพ', accountNo: '444444', branch: 'ลาดพร้าว' },
  'ธนาคาร 5': { name: 'ธนาคารไทยพาณิชย์', logo: 'https://i.pinimg.com/736x/02/31/87/023187a2f2dc47bbdc809b43c7667b3a.jpg', accountName: 'บัญชีไทยพาณิชย์', accountNo: '5552121555', branch: 'สุขุมวิท' },
  'ธนาคาร 6': { name: 'K Plus', logo: 'https://i.pinimg.com/736x/66/3b/5e/663b5ede3b55beaee63bf3100db21f25.jpg', accountName: 'K Plus', accountNo: '666666111111', branch: 'เซ็นทรัล' },
};

const banks = ['ธนาคารกสิกรไทย', 'ธนาคารกรุงศรี', 'ธนาคารกรุงเทพ', 'ธนาคารไทยพาณิชย์'];

const paymentMethods = [
  'Mobile Banking',
  'Credit and Debit',
  'PromptPay',
  'TrueMoney',
  'Line Pay',
  'Google Pay',
  'WeChat Pay',
  'Alipay (Online)',
  'Internet Banking',
];

const paymentLogos = {
  'Mobile Banking': Object.values(bankDetails).map(bank => bank.logo), // รวมโลโก้ทุกธนาคาร
  'PromptPay': ['https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png'],
  'Credit and Debit': [
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  ],
  'TrueMoney': ['https://play-lh.googleusercontent.com/6I2IYbIg4rhGUgs0UxP_5q6wmJmlBjBrlQ9f0_FAN94yOzwmrtEteifCdPPd1-chY_NX'],
  'Line Pay': ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/LINE_Pay_logo_%282019%29.svg/522px-LINE_Pay_logo_%282019%29.svg.png?20230430032803'],
  'Google Pay': ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png'],
  'WeChat Pay': ['https://banner2.cleanpng.com/20180526/yvk/avp1ts4jr.webp'],
  'Alipay (Online)': ['https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Alipay_logo_%282020%29.svg/529px-Alipay_logo_%282020%29.svg.png?20210305161805'],
  'Internet Banking': Object.values(bankDetails).map(bank => bank.logo), // รวมโลโก้ทุกธนาคาร
};
  return (
  
     
     
      
      <div className="step3-dropdown-container">
        {/* Payment Methods Dropdown */}
        {paymentMethods.map((method, index) => (
          <div key={index} >
       <div  
        className={`step3-dropdown ${invalidAttempt && method === selectedPaymentMethod ? 'invalid' : ''} ${isSaved && method !== selectedPaymentMethod ? 'disabled' : ''}`}
        onClick={() => handlePaymentMethodSelect(method)}
      >
       <div className={`step3-icon-circle-container ${selectedPaymentMethod === method && isSaved ? 'selected' : ''}`}>
  <div className={`step3-icon-circle ${selectedPaymentMethod === method && isSaved ? 'selected' : ''}`}>
    <span>
      ✔
    </span>
  </div>

  <p>
    {method}
  </p>
</div>

 <div className="step3-bank-logos">
  {paymentLogos[method] &&
    paymentLogos[method].map((logo, idx) => (
      <img 
        key={idx} 
        src={logo} 
        alt={method} 
        className={`
          ${method === 'Mobile Banking' || method === 'Internet Banking' 
            ? 'mobile-bank' 
            : ''}
        `} 
      />
    ))
  }
</div>

</div>

            {openDropdown === method && isPaymentMethodSelected && (
              <div>
                {/* Payment method specific details */}
                {method === 'Mobile Banking' && (
                  <div>
                     <div className="step3-bank-selection">
                      {Object.keys(bankDetails).map((bankKey) => {
                        const bank = bankDetails[bankKey];
                        return (
                          <div key={bankKey} className="step3-bank-column" onClick={() => handleBankSelect(bankKey)}>
                             <div className="step3-bank-box">
                            <img src={bank.logo} alt={bank.name} className="step3-bank-logo" />
                            <p className="step3-bank-name">{bank.name}</p>
                            <div 
  className={`step3-check-circle ${selectedBank === bankKey ? 'selected' : ''}`}
>
  <div 
    className={`step3-check-circle-inner ${selectedBank === bankKey ? 'selected' : ''}`}
  ></div>
</div>

                            </div>
                          
                          </div>
                        );
                      })}
                    </div>

                    
              <div className="step3-dashed-line" />
              
              
              <p className="step3-bold-text">การชำระเงินด้วยการโอนเงิน</p>
              <p className="step3-text">โอนเงินผ่านเค้าท์เตอร์ธนาคาร, Mobile App, Online Banking</p>
<p className="step3-text">ท่านสามารถโอนเงินตามยอดรวมทั้งหมดมายังธนาคารเหล่านี้</p>


              {selectedBank && (
  <div className="step3-details">
    <div className="step3-account-row">
      <span className="step3-account-label">Account Name.</span>
      <span className="step3-account-value"> {bankDetails[selectedBank].accountName}</span>
    </div>
    <div className="step3-bank-row">
      {/* โลโก้ธนาคาร */}
      <div className="step3-logo-container">
        <img
          src={bankDetails[selectedBank].logo}
          alt="Bank Logo"
          className="step3-branch-logo"
        />
      </div>
      {/* ข้อมูลธนาคารและบัญชี */}
      <div className="step3-bank-details">
        <div className="step3-bank-name-row">
          <span className="step3-branch-name">{bankDetails[selectedBank].name}</span>
        </div>
        <div className="step3-account-row">
          <span className="step3-account-label">Account No. </span>
          <span className="step3-account-value"> {bankDetails[selectedBank].accountNo}</span>
        </div>
        <div className="step3-account-row">
          <span className="step3-account-label">Branch:</span>
          <span className="step3-account-value">{bankDetails[selectedBank].branch}</span>
        </div>
      </div>
    </div>
  </div>
)}



{selectedBank && (
  <div className="step3-upload-container">
     <label className="step3-upload-label">
    อัพโหลดหลักฐานการชำระเงิน
  </label>
    <input 
      type="file" 
      onChange={handleFileUpload} 
      className="step3-file-input" 
    />
    {uploadedSlip && (
      <div className="step3-preview-container">
        <img 
          src={URL.createObjectURL(uploadedSlip)} 
          alt="Uploaded Slip" 
         className="step3-preview-image"
        />

        <button 
          onClick={handleRemoveFile} 
         className="step3-remove-button"
        >
          X
        </button>
      </div>
    )}
    <p>
                ขอบคุณที่เลือกชำระเงินผ่าน
                {selectedBank && (
                  <span>
                    {bankDetails[selectedBank].name}
                    <img 
                      src={bankDetails[selectedBank].logo}
                      alt="Selected Bank Logo"
                      className="step3-selected-bank-logo"
                    />
                  </span>
                )}
              </p>
              
 <button 
  className="step3-save-button"
  onClick={handleSave}
>
  บันทึก
</button>

  </div>
)}
                  </div>
                )}

{method === 'Credit and Debit' && (
                  <div>
                       <h1 className="step3-bold-text">ชำระผ่าน Credit Card</h1>
<div>
  <p className="step3-text-center">
    ท่านสามารถชำระผ่านบัญชี Credit Card ทันที
  </p>
  <p className="step3-text-left">
    หลังจากชำระเงินแล้วระบบจะทำการส่งเอกสารยืนยันการจองเข้าไปในอีเมลพร้อมเดินทางทันที
  </p>
</div>

      <div className="step3-container">
       {/* ✅ บัตรเครดิตสีน้ำเงิน */}
       <div className="step3-card">
       <div className="step3-card-bank-name">{issuerBank || "Bank Name"}</div>
       <div className="step3-chip-container">
       <div className="step3-chip">
        
       <img width="90" height="90" src="https://img.icons8.com/carbon-copy/90/sim-card-chip.png" alt="sim-card-chip"/>
      </div>
      <img width="40" height="40" src="https://img.icons8.com/windows/50/FFFFFF/contactless-payment.png" alt="contactless-payment"/>
      </div>
       
        <div className="step3-card-number">
          {cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}
        </div>
        <div className="step3-card-details">
          <div>
            <span className="step3-card-label">CARD HOLDER</span>
            <p className="step3-card-data">{cardHolderName || "NAME SURNAME"}</p>
          </div>
          <div>
            <span className="step3-card-label">VALID THRU</span>
            <p className="step3-card-data">{expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "MM/YY"}</p>
          </div>
        </div>
        <div className="step3-footer">
        
          <span className="step3-footer-text">Copyright 2024 © Phuket Innovative Development Co., Ltd.</span>
        </div>
      </div>
      </div>

      <div className="step3-form-container">
         {/* Left side - Form */}
         <div className="step3-form-section">
         <form onSubmit={handleFormSubmit} className="step3-payment-form">
        {/* Issuer Bank */}
        <div className="step3-form-field">
          <div className="step3-label">Issuer Bank*</div>
          <select
            value={issuerBank}
            onChange={(e) => handleInputChange(e, setIssuerBank)}
            required
            className="step3-input"
          >
            <option value="">Issuer Bank</option>
            {banks.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Card Holder Name */}
        <div className="step3-form-field">
          <div className="step3-label">Card Holder Name*</div>
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) => handleInputChange(e, setCardHolderName)}
            placeholder="Card holder name"
            required
           className="step3-card-input"
          />
        </div>

        {/* Card Number */}
        <div className="step3-form-field">
          <div className="step3-label">Credit/Debit Card Number*</div>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => handleInputChange(e, setCardNumber)}
            placeholder="Credit/Debit card number"
            required
            className="step3-card-input"
          />
        </div>

        {/* Expiry Date & CVV */}
        <div className="step3-expiry-container">
          <div>
            <div className="step3-label">Expiry Date*</div>
            <div className="step3-expiry-inputs">
              <select
                value={expiryMonth}
                onChange={(e) => handleInputChange(e, setExpiryMonth)}
                required
                className="step3-input-small"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={expiryYear}
                onChange={(e) => handleInputChange(e, setExpiryYear)}
                required
               className="step3-input-small"
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="step3-label">CVV*</div>
            <input
              type="text"
              value={cvv}
              onChange={(e) => handleInputChange(e, setCvv)}
              placeholder="CVV"
              required
              className="step3-input-cvv"
            />
          </div>
        </div>
  {/* Terms Text */}
  <p className="step3-terms-text">
  โดยการลงทะเบียนข้อมูลการชำระเงินข้างต้น ถือว่าท่านได้อนุญาตให้บริษัท ภูเก็ต อินโนเวทีฟ เดเวลลอปเมนท์ จำกัด เรียกเก็บเงินจากวิธีการชำระเงินของท่านทันที สำหรับใบแจ้งหนี้ที่ครบกำหนดหรือค้างชำระ ท่านสามารถแก้ไขข้อมูลการชำระเงินนี้ได้ตลอดเวลาโดยการเข้าสู่ระบบบัญชีของท่าน
      </p>
        {/* Submit Button */}
        <button type="submit" className="step3-card-save-button"   onClick={handleSave}>
          บันทึก
        </button>
      </form>
        </div>

      </div>
                  </div>
                )}
                {method === 'PromptPay' && (
                  <div >
                         <p className="step3-bold-text">ชำระผ่าน PropmtPay</p>
              <p className="step3-text-left">หลังจากชำระเงินแล้วระบบจะทำการส่งเอกสารยืนยันการจองเข้าไปให้ที่อีเมล์ พร้อมเดินทางทันที</p>
              <img 
                  src="/qr-test.jpg"
                  alt="QR"
                  className="step3-qr"
              />

<div className="step3-upload-container">
    <label 
      className="step3-upload-label"
    >
      อัพโหลดหลักฐานการชำระเงิน
    </label>
    <input 
      type="file" 
      onChange={handleFileUpload} 
     className="step3-file-input"
    />
    {uploadedSlip && (
      <div className="step3-previewContainer">
        <img 
          src={URL.createObjectURL(uploadedSlip)} 
          alt="Uploaded Slip" 
         className="step3-preview-image"
        />
        <button 
          onClick={handleRemoveFile} 
          className="step3-remove-button"
        >
          X
        </button>
      </div>
    )}
   
              
    <button 
      className="step3-save-button"
      onClick={handleSave}
    >
      บันทึก
    </button>
  </div>

                  </div>
                )}


              </div>
            )}
          </div>
        ))}
      </div>
     
      

     
  
    
  );
}

export default Step3;


