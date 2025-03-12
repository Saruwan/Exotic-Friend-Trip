import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGoogle, FaFacebook, FaLine, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate(); // ใช้ useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ส่งข้อมูล formData ไปยัง backend (จะเพิ่มในขั้นตอนต่อไป)
  };

  // ฟังก์ชันสำหรับนำทางกลับไปหน้า App.js
  const handleClose = () => {
    navigate('/'); // นำทางไปหน้าแรก (App.js)
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <form onSubmit={handleSubmit}>
            <Title>สมัครสมาชิก</Title>
            <InputWrapper>
              <Input
                type="text"
                placeholder="ชื่อ"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                placeholder="นามสกุล"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <Input
              type="email"
              placeholder="อีเมล"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Icon onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Icon>
            </PasswordWrapper>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="ยืนยันรหัสผ่าน"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Icon onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Icon>
            </PasswordWrapper>
            <Button type="submit">สมัครสมาชิก</Button>
          </form>
          <SocialText>หรือเข้ารู่ระบบด้วย:</SocialText>
          <SocialIcons>
            <FaGoogle size={30} />
            <FaFacebook size={30} />
            <FaLine size={30} />
            <FaApple size={30} />
          </SocialIcons>
          <Note>
            การลงทะเบียนถือว่าท่านยอมรับ เงื่อนไขการใช้บริการ และ นโยบายความเป็นส่วนตัว ของเรา
          </Note>
        </FormWrapper>
        <ImageSection>
          <CloseButton onClick={handleClose}>&times;</CloseButton> {/* ปรับปุ่มกากบาท */}
          <PromoImage src="regis.jpg" alt="Promotion" />
          <PromoText>
            <h3>ล็อกอินเพื่อรับสิทธิประโยชน์มากยิ่งขึ้น!</h3>
            <ul>
              <li>รับประกันราคาที่ดีที่สุดเมื่อจอง</li>
              <li>รับข้อเสนอที่ดีที่สุดสำหรับสมาชิกและลูกค้า VIP</li>
              <li>รับ TripOnTour เมื่อใช้เป็นส่วนลดในการจอง</li>
              <li>สะสมยอดจองเพื่อรับสถานะลูกค้า VIP ของโกทัวร์</li>
            </ul>
          </PromoText>
        </ImageSection>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 80%;
  max-width: 1000px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FormWrapper = styled.div`
  flex: 1;
  padding: 40px;
`;

const Title = styled.h2`
  text-align: center;
  color: #003580;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; /* ทำให้เต็มความกว้าง */
  margin-top: 10px;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%; /* ทำให้เต็มความกว้าง */
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%; /* ทำให้ปุ่มเต็มความกว้าง */
  padding: 10px;
  margin-top: 20px;
  background-color: #003580;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Icon = styled.div`
  position: absolute;
  right: 10px;
  top: 12px;
  cursor: pointer;
`;

const SocialText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #003580;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const Note = styled.p`
  text-align: center;
  font-size: 12px;
  color: #555;
`;

const ImageSection = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
  position: relative;
  background-color: #f5f5f5;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  border: none;
  background: none;
  cursor: pointer;
`;

const PromoImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const PromoText = styled.div`
  margin-top: 20px;
  text-align: left;
  color: #003580;
  h3 {
    font-weight: bold;
  }
  ul {
    padding-left: 20px;
  }
  li {
    list-style-type: disc;
    margin-top: 5px;
  }
`;

export default SignUpForm;
