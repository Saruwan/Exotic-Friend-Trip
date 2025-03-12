import React from 'react';
import styled from 'styled-components';
import './Packages.css';
const Packages = () => {
  const packages = [
    {
      name: 'ทัวร์ต่างประเทศ',
      description: 'รวมไฮไลท์ทัวร์ต่างประเทศ แพ็กเกจสุดปัง ราคาดีที่สุด ในปี 2565-2566',
      image: 'url(/m1.jpg)',
    },
    {
      name: 'ทัวร์เน้นธรรมชาติ',
      description: 'สายธรรมชาติห้ามพลาด สดชื่นจากแสงบริสุทธิ์ ชมทัศนียภาพแบบจุใจ',
      image: 'url(/m2.jpg)',
    },
    {
      name: 'ทัวร์ The Unseen',
      description: 'ทัวร์หาชมความงามสถานที่ที่ไม่ค่อยมีใครเยือน อย่างแกร่งริล่าและแสงเหนือในนอร์เวย์',
      image: 'url(/m3.jpg)',
    },
    {
      name: 'ทัวร์เน้นช้อปปิ้ง',
      description: 'ช้อปเพลินกับบรรยากาศเมือง มุราคุ หรือชิบูย่า ขาช้อปห้ามพลาดทริปนี้',
      image: 'url(/m4.jpg)',
    },
  ];

  return (
    <div className="package-container">
      <h2 className="package-title">แพ็กเกจท่องเที่ยวตามไลฟ์สไตล์</h2>
      <div className="package-underline" />
      <p className="package-subtitle">เลือกสถานที่ท่องเที่ยวที่ใช่กับไลฟ์สไตล์ที่ชอบ</p>
      <div className="package-grid">
        {packages.map((pkg, index) => (
          <div key={index} className="package-card" style={{ backgroundImage: pkg.image }}>
            <div className="package-overlay">
              <h3 className="package-name">{pkg.name}</h3>
              <p className="package-description">{pkg.description}</p>
              <button className="package-button">ดูเพิ่มเติม</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default Packages;
