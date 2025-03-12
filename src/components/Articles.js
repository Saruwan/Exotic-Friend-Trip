import React, { useState } from 'react';
import styled from 'styled-components';
import { FaShareAlt } from 'react-icons/fa';
import { BsStarFill } from 'react-icons/bs';

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articles = [
    { title: 'ทัวร์ญี่ปุ่น ชิโบโระ', description: 'ชมภูเขาไฟโซระและบ่อน้ำร้อนฟุกุชิมะ สัมผัสธรรมชาติอันบริสุทธิ์', schedule: 'ทั้งปี', price: '฿ 25,000', rating: 5 },
    { title: 'ทัวร์ญี่ปุ่น ซัปโปโร', description: 'เที่ยวเมืองซัปโปโรและชมศาลเจ้าฮอกไกโด', schedule: 'เมษายน - กันยายน', price: '฿ 30,000', rating: 4 },
    { title: 'ทัวร์ญี่ปุ่น เกียวโต', description: 'เยี่ยมชมวัดโบราณและเทศกาลซากุระ', schedule: 'มีนาคม - เมษายน', price: '฿ 28,000', rating: 4 },
    { title: 'ทัวร์ญี่ปุ่น โอซาก้า', description: 'สัมผัสแสงสีในย่านโดทงโบริ และสวนสนุกยูนิเวอร์แซล', schedule: 'ทั้งปี', price: '฿ 27,000', rating: 5 },
    { title: 'ทัวร์ญี่ปุ่น โตเกียว', description: 'ชมเมืองหลวงที่ทันสมัยและวัฒนธรรมดั้งเดิม', schedule: 'กรกฎาคม - สิงหาคม', price: '฿ 35,000', rating: 4 },
    { title: 'ทัวร์ญี่ปุ่น นาโกย่า', description: 'สำรวจปราสาทนาโกย่าและแหล่งช้อปปิ้ง', schedule: 'ตุลาคม - พฤศจิกายน', price: '฿ 26,000', rating: 3 },
  ];

  const getImagePath = (title) => {
    const sanitizedTitle = title.replace(/\s+/g, '_');
    return `${process.env.PUBLIC_URL}/${sanitizedTitle}.jpg`;
  };

  return (
    <Container>
    <Title>บทความท่องเที่ยวที่น่าสนใจ</Title>
    <Underline />
    <Content>
      <LargeArticle>
        <Image src={getImagePath('ทัวร์ญี่ปุ่น ชิโบโระ')} alt="บทความใหญ่" />
        <LargeTitle>ทัวร์ญี่ปุ่น ชิโบโระ ไซตามะ</LargeTitle>
        <Description>ชมความงามของธรรมชาติในฤดูหนาวที่น้ำพุหิมะ ฟุกุชิมะ และภูเขาไฟไซตามะ</Description>
      </LargeArticle>
        
        <ArticleList>
          {articles.map((article, index) => (
            <ArticleCard key={index}>
              <Thumbnail src={getImagePath(article.title)} alt={article.title} />
              <ArticleInfo>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDescription>{article.description}</ArticleDescription>
                <DetailRow>
                  <OrangeButton>ช่วงเวลาจัดทัวร์</OrangeButton>
                  <DetailText>{article.schedule}</DetailText>
                </DetailRow>
                <DetailRow>
                  <OrangeButton>ค่าใช้จ่าย</OrangeButton>
                  <DetailText>{article.price}</DetailText>
                </DetailRow>
                <DetailRow>
                  <OrangeButton>ความประทับใจ</OrangeButton>
                  <DetailText>
                    {Array(article.rating).fill().map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </DetailText>
                </DetailRow>
                <ButtonGroup>
                  <DetailButton>ดูรายละเอียด</DetailButton>
                  <ShareButton><FaShareAlt /></ShareButton>
                </ButtonGroup>
              </ArticleInfo>
            </ArticleCard>
          ))}
        </ArticleList>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px 10px;
  text-align: center;
  max-width: 1200px;
  margin: auto;
  border-radius: 8px;
   position: relative; /* เพิ่ม position: relative ตรงนี้ */
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #003580;
  margin-bottom: 5px;
`;

const Underline = styled.div`
  width: 150px;
  height: 3px;
  background-color: #003580;
  margin: 0 auto 30px;
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  position: relative; /* เพิ่มตำแหน่งให้กำหนด position ของ VerticalPagination ได้ */
`;





const PageIndicator = styled.button`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? '#f8a24e' : 'transparent')};
  border: 2px solid #f8a24e;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const LargeArticle = styled.div`
  flex: 1;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 1;
`;

const LargeTitle = styled.h3`
  font-size: 1rem;
  margin-top: 8px;
`;

const Description = styled.p`
  color: #555;
  font-size: 0.9rem;
`;

const ArticleList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 2;
`;

const ArticleCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 200px;
  width: 100%;
`;

const Thumbnail = styled.img`
  width: 45%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1;
`;

const ArticleInfo = styled.div`
  padding: 5px 5px 5px; // เพิ่ม padding ด้านบนให้ชื่อทัวร์ขยับขึ้น
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 5px;
`;

const ArticleTitle = styled.h4`
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
  margin-top: 4px; // เพิ่มระยะห่างจากด้านบน
`;


const ArticleDescription = styled.p`
  color: #555;
  font-size: 0.7rem;
  margin-bottom: 1px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
`;

const OrangeButton = styled.div`
  background-color: #f8a24e;
  color: #fff;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 0.6rem;
  min-width: 80px;
  text-align: center;
`;

const DetailText = styled.span`
  font-size: 0.6rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px; // เพิ่มระยะห่างระหว่างปุ่มเล็กน้อย
  align-items: center;
  margin-top: 12px; // เพิ่มระยะห่างจากด้านบนเพื่อให้ปุ่มดูไม่แน่นเกินไป
`;

const DetailButton = styled.button`
  background-color: #1d72b8;
  color: #fff;
  padding: 7px 45px; // เพิ่ม padding เพื่อทำให้ปุ่มยาวและใหญ่ขึ้น
  border: none;
  border-radius: 6px; // เพิ่มความโค้งมนเล็กน้อยให้ดูสวยงามขึ้น
  cursor: pointer;
  font-size: 0.8rem; // เพิ่มขนาดฟอนต์เล็กน้อย
  font-weight: bold; // ทำให้ข้อความดูเด่นขึ้น
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #155a8a; // เปลี่ยนสีเมื่อ hover เพื่อเพิ่มความน่าสนใจ
  }
`;


const ShareButton = styled.button`
  background-color: #f0f0f0;
  padding: 3px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StarIcon = styled(BsStarFill)`
  color: #ffcc00;
  margin-left: 2px;
  font-size: 0.7rem;
`;

export default Articles;
