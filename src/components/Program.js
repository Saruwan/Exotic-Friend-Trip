import React from 'react';
import { BiUnderline } from 'react-icons/bi';
import styled from 'styled-components';
import "./Program.css"
const Programs = () => {
  const programs = [
    { title: "JAPAN ทัวร์ชมซากุระ", price: "33,999฿", imgSrc: "สนใจ1.jpg" },
    { title: "JAPAN โอซาก้า โตเกียว", price: "27,999฿", imgSrc: "สนใจ2.jpg" },
    { title: "JAPAN ฮอกไกโด", price: "30,999฿", imgSrc: "สนใจ3.jpg" },
    { title: "Tokyo Fuji", price: "27,888฿", imgSrc: "สนใจ4.jpg" },
    { title: "FIN JAPAN โอกินาว่า พังงา", price: "23,900฿", imgSrc: "สนใจ5.jpg" },
    { title: "JAPAN ชมดอกไฮเดรนเยีย", price: "30,999฿", imgSrc: "สนใจ6.jpg" },
  ];

  return (
    <div className="program-container">
      <h2 className="program-title">โปรแกรมที่น่าสนใจ</h2>
      <div className="program-underline" />
      <div className="program-grid">
        {programs.map((program, index) => (
          <div className="program-card" key={index}>
            <div className="program-image-container">
              <img className="program-image" src={program.imgSrc} alt={program.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Programs;
