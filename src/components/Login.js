import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGoogle, FaFacebook, FaLine, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for routing

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login form submission here
  };

  // Navigate back to the home page when CloseButton is clicked
  const handleClose = () => {
    navigate('/');
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>เข้าสู่ระบบ</Title>
          <Subtitle>เพื่อความปลอดภัย กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดของท่าน</Subtitle>
          <form onSubmit={handleSubmit}>
            <Label>อีเมล</Label>
            <Input
              type="email"
              placeholder="อีเมล"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Label>รหัสผ่าน</Label>
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
            <Button type="submit">เข้าสู่ระบบ</Button>
          </form>
          <Options>
            <Link>สร้างบัญชีใหม่</Link>
            <Link>ลืมรหัสผ่าน?</Link>
          </Options>
          <SocialText>หรือเข้าสู่ระบบด้วย:</SocialText>
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
          <CloseButton onClick={handleClose}>&times;</CloseButton> {/* Close button navigates to home */}
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
  background-color: transparent; /* เปลี่ยนจาก #fff เป็น transparent */
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
  color: #003580;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  right: 10px;
  top: 12px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #003580;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Link = styled.a`
  font-size: 12px;
  color: #003580;
  cursor: pointer;
  text-decoration: underline;
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
  background-color: #f5f5f5;
  position: relative;
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
  color: #003580;
  h3 {
    font-weight: bold;
  }
  ul {
    padding-left: 20px;
    margin: 0;
  }
  li {
    list-style-type: disc;
    margin-top: 5px;
  }
`;

export default LoginPage;
