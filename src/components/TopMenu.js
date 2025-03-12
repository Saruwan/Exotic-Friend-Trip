import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import languages from "./languages.json";
import currencies from "./currencies.json";
import "./TopMenu.css";
import styled from "styled-components";
import {FaEye, FaEyeSlash, FaSearch, FaShoppingCart, FaBars, FaTimes, FaMoneyBillAlt, FaSignInAlt, FaUserPlus,
} from "react-icons/fa";
import { auth, provider, signInWithPopup, signInWithGoogle } from "./firebase"; // นำเข้า Firebase

Modal.setAppElement("#root");

const TopMenu = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userData, setUserData] = useState(null); // สถานะของข้อมูลผู้ใช้

  const [activeMenu, setActiveMenu] = useState("หน้าแรก");
  const [language, setLanguage] = useState({ code: "th", name: "Thai" });
  const [currency, setCurrency] = useState({ code: "THB", name: "Thai Baht" });
  const [budget, setBudget] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserData = localStorage.getItem("userData");

    if (storedIsLoggedIn === "true" && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(data));

    // ปิด Modal ทันทีหลังจากล็อกอินสำเร็จ
    closeLoginModal();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);

    // ล้างข้อมูลใน localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle menu open/close state
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Set active menu and close the menu
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsMenuOpen(false);
  };

  // Modal open/close handlers for language and currency selection
  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);
  const openCurrencyModal = () => setIsCurrencyModalOpen(true);
  const closeCurrencyModal = () => setIsCurrencyModalOpen(false);

  // Set language and currency selections
  const selectLanguage = (lang) => {
    setLanguage(lang);
    closeLanguageModal();
  };
  const selectCurrency = (curr) => {
    setCurrency(curr);
    closeCurrencyModal();
  };

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // Handle login modal
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false); // ปิด Login Modal
    setIsRegisterModalOpen(true); // เปิด Register Modal
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user.photoURL); // เช็คว่าได้รับ URL ของรูปภาพหรือไม่

      const userData = {
        name: user.displayName,
        avatar: user.photoURL || "default-avatar.png", // ใช้รูปภาพ default หากไม่มี
      };

      handleLoginSuccess(userData);
      closeLoginModal();
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  useEffect(() => {
    const loadFbSdk = () => {
      if (!document.getElementById("facebook-jssdk")) {
        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.onload = () => {
          console.log("Facebook SDK loaded");
          initializeFacebookSdk();
        };
        document.body.appendChild(script);
      }
    };

    const initializeFacebookSdk = () => {
      if (window.FB && !window.FB._initialized) {
        window.FB.init({
          appId: "1085619170022700", // ใส่ Facebook App ID
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
        window.FB._initialized = true;
        console.log("Facebook SDK initialized");
      } else if (window.FB) {
        console.log("Facebook SDK already initialized");
      } else {
        console.error("Facebook SDK not loaded");
      }
    };

    loadFbSdk();
  }, []);

  // ฟังก์ชันสำหรับการล็อกอินผ่าน Facebook
  const handleFacebookLogin = () => {
    if (window.FB) {
      window.FB.login(
        (response) => {
          if (response.status === "connected") {
            fetchFacebookUserData();  // ถ้าล็อกอินสำเร็จให้ดึงข้อมูลผู้ใช้
          } else {
            console.error("User failed to log in:", response);
          }
        },
        { scope: "public_profile,email" }
      );
    } else {
      console.error("Facebook SDK not loaded yet.");
    }
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก Meta
  const fetchFacebookUserData = () => {
    window.FB.api("/me", { fields: "id,name,email,picture" }, (response) => {
      if (response && !response.error) {
        const user = {
          id: response.id,
          name: response.name,
          email: response.email,
          avatar: response.picture.data.url, // ดึงรูปโปรไฟล์จาก Facebook
        };

        setIsLoggedIn(true); // อัปเดต state ให้รู้ว่าเข้าสู่ระบบแล้ว
        setUserData(user);

        // เก็บข้อมูลใน Local Storage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(user));

        // ปิด Modal หลังจากล็อกอินสำเร็จ
        closeLoginModal();
      } else {
        console.error("Error fetching user data:", response.error);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const budgetBox = document.querySelector(".budget-box");
    const searchInput = document.querySelector(".search-input");
    const budgetInput = document.querySelector(".budget-input");
    const searchButton = document.querySelector(".search-button");

    // เปิด/ปิดช่องค้นหา
    searchBox.addEventListener("click", () => {
      searchBox.classList.add("expanded");
      searchInput.focus();
    });

    budgetBox.addEventListener("click", () => {
      budgetBox.classList.add("expanded");
      budgetInput.focus();
    });

    // ย่อช่องเมื่อคลิกนอกกรอบ
    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target)) {
        searchBox.classList.remove("expanded");
      }
      if (!budgetBox.contains(e.target)) {
        budgetBox.classList.remove("expanded");
      }
    });

    // ตรวจสอบข้อมูลในช่องค้นหา
    searchButton.addEventListener("click", () => {
      if (!searchInput.value.trim() && !budgetInput.value.trim()) {
        searchBox.classList.add("error");
        setTimeout(() => searchBox.classList.remove("error"), 5000);
      } else {
        window.location.href = "/TourList"; // ไปยังหน้า TourList
      }
    });
  });

  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  
  const toggleRightMenu = () => setIsRightMenuOpen(!isRightMenuOpen);
  
  useEffect(() => {
    // ปิดเมนูขวาเมื่อมีการเปิดโมดัล
    if (isLoginModalOpen || isRegisterModalOpen || isLanguageModalOpen || isCurrencyModalOpen) {
      setIsRightMenuOpen(false);
    }
  }, [isLoginModalOpen, isRegisterModalOpen, isLanguageModalOpen, isCurrencyModalOpen]);
  
  
  return (
    <div className="top-menu">
      {/* Left section with logo and hamburger menu */}
      <div className="top-left-section">
        <img src="ExoticFriendTrip.png" alt="Logo" className="top-logo" />
      
        {/* Dynamic menu items */}
        <div className={`top-menu-items ${isMenuOpen ? "open" : ""}`}>
          {["หน้าแรก", "เกี่ยวกับเรา", "ติดต่อเรา"].map((menu) => (
            <span
              key={menu}
              className={`top-menu-item ${activeMenu === menu ? "active" : ""}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </span>
          ))}
        </div>
      </div>

      {/* Right section with search, budget, language, currency, cart, and user options */}
      <div className="top-right-section">
          {/* Hamburger Button for Small Screens */}
          <button className="top-hamburger" onClick={toggleRightMenu}>
          {isRightMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`top-right-menu ${isRightMenuOpen ? "open" : ""}`}>
        <div className="top-search-box">
          <input
            type="text"
            placeholder="ค้นหาสถานที่ท่องเที่ยว"
            className="top-search-input"
          />
          <button className="top-search-button">
            <FaSearch />
          </button>
        </div>
        <div className="top-budget-box">
          <input
            type="text" // เปลี่ยนจาก number เป็น text
            placeholder="งบประมาณ (THB)"
            className="top-budget-input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <div className="top-budget-icon">
            <FaMoneyBillAlt />
          </div>
        </div>

        {/* Language and Currency selectors */}
        <div className="top-language-box" onClick={openLanguageModal}>
          <img
            src={`https://flagpedia.net/data/flags/h80/${language.code}.png`}
            alt="Flag"
          />
        </div>
        <div className="top-currency-box" onClick={openCurrencyModal}>
          <span>{currency.code}</span>
        </div>

        <div className="top-cart-box">
          <FaShoppingCart className="top-cart-icon" />
        </div>

        {isLoggedIn ? (
          <div className="top-user-info">
            <div className="top-user-divider"/>

            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt="Avatar"
                onClick={handleLogout} // คลิกที่รูปเพื่อทำการ Logout
               className="top-user-avatar"
              />
            ) : (
              <div
                onClick={handleLogout} // คลิกที่กรอบแทน ถ้าไม่มีรูป
              className="top-user-placeholder"
              >
                No Avatar
              </div>
            )}

            <div className="top-user-details">
              <span>{userData.name}</span>
              <span className="top-user-status">
                กำลังใช้งาน
              </span>
            </div>
          </div>
        ) : (
          <>
            <button
              className="top-sign-in-button"
              onClick={openLoginModal}
            >
              <span>Sign in</span>
              <FaSignInAlt />
            </button>

            <button
              className="top-create-account-button"
              onClick={openRegisterModal}
             
            >
              <span>Create account</span>
              <FaUserPlus />
            </button>
          </>
        )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal
  isOpen={isLoginModalOpen}
  onRequestClose={closeLoginModal}
  className="top-modal"
  overlayClassName="top-modal-overlay"
  contentLabel="Login Modal"
>
        <div className="top-content-wrapper">
          <div className="top-form-wrapper">
            <div className="top-title">เข้าสู่ระบบ</div>
            <p className="top-subtitle">
              เพื่อความปลอดภัย กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดของท่าน
            </p>
            <form onSubmit={handleSubmit}>
              <label className="top-label">อีเมล</label>
              <input
                type="email"
                className="top-input"
                placeholder="อีเมล"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label className="top-label">รหัสผ่าน</label>
              <div className="top-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="top-input"
                  placeholder="รหัสผ่าน"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
               
              </div>
              <button className="top-button">
                เข้าสู่ระบบ
              </button>
            </form>
            <div className="top-options">
              <a className="top-link" onClick={openRegisterModal}>สร้างบัญชีใหม่</a>
              <a className="top-link">ลืมรหัสผ่าน?</a>
            </div>
            <p className="top-social-login" >
           
              หรือเข้าสู่ระบบด้วย :
             
            </p>
            <div className="top-social-icons">
  <button onClick={handleGoogleLogin}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
    <span>Google</span>
  </button>
  <button onClick={handleFacebookLogin}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" />
    <span>Facebook</span>
  </button>
  <button>
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="Line" />
    <span>Line</span>
  </button>
  <button>
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
    <span>Apple</span>
  </button>
</div>

            <p className="top-note">
  การลงทะเบียนถือว่า
  <span>ท่านยอมรับ</span>
  เงื่อนไขการใช้บริการ และ
  <span> นโยบายความเป็นส่วนตัว</span>
  ของเรา
</p>

          </div>
          <div className="top-image-section">
            <button className="top-close-button" onClick={closeLoginModal}>&times;</button>
            <img className="top-promo-image" src="https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_861/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/p8q2ioziunxzkk9jn4s9/%E0%B8%97%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A5%E0%B8%B2%E0%B8%94:%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%A4%E0%B8%94%E0%B8%B9%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86(%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%A1%E0%B8%A7%E0%B8%B1%E0%B8%99).webp" alt="Promotion" />
            <div className="top-promo-text">
              <h3>ล็อกอินเพื่อรับสิทธิประโยชน์มากยิ่งขึ้น !</h3>
              <ul>
                <li>รับประกันราคาที่ดีที่สุดเมื่อจอง</li>
                <li>รับข้อเสนอที่ดีที่สุดสำหรับสมาชิกและลูกค้า VIP</li>
                <li>รับ TripOnTour เมื่อใช้เป็นส่วนลดในการจอง</li>
                <li>สะสมยอดจองเพื่อรับสถานะลูกค้า VIP ของโกทัวร์</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal
  isOpen={isRegisterModalOpen}
  onRequestClose={closeRegisterModal}
  className="top-modal"
  overlayClassName="top-modal-overlay"
  contentLabel="Register Modal"
>
        <div className="top-content-wrapper">
          <div className="top-form-wrapper">
            <div className="top-title">สมัครสมาชิก</div>

            <form onSubmit={handleSubmit}>
             
              <div className="top-name-container">
 
    <label className="top-label">ชื่อ</label>
    <input
      type="text"
      placeholder="ชื่อ"
       className="top-input"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      required
    />
 
 
    <label className="top-label">นามสกุล</label>
    <input
      type="text"
      placeholder="นามสกุล"
      className="top-input"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      required
    />
 
</div>

             
              <label className="top-label">อีเมล</label>
              <input
                type="email"
                placeholder="อีเมล"
                className="top-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="top-password-wrapper">
                <label className="top-label">รหัสผ่าน</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  className="top-input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
            
              </div>
              <div className="top-password-wrapper">
                <label className="top-label">ยืนยันรหัสผ่าน</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่าน"
                   className="top-input"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              
              </div>
              <button type="submit" className="top-button">สมัครสมาชิก</button>
            </form>
            <p className="top-social-text">
 
  หรือเข้าสู่ระบบด้วย :
 
</p>

<div className="top-social-icons">
  <button onClick={handleGoogleLogin}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
    <span>Google</span>
  </button>
  <button onClick={handleFacebookLogin}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" />
    <span>Facebook</span>
  </button>
  <button>
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="Line" />
  <span>Line</span>
  </button>
  <button>
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
  <span>Apple</span>
  </button>
</div>

<p className="top-note">
  การลงทะเบียนถือว่า
  <span>ท่านยอมรับ</span>
  เงื่อนไขการใช้บริการ และ
  <span> นโยบายความเป็นส่วนตัว</span>
  ของเรา
</p>

          </div>
          <div className="top-image-section">
            <button className="top-close-button" onClick={closeRegisterModal}>&times;</button>
            <img className="top-promo-image" src="https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_861/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/p8q2ioziunxzkk9jn4s9/%E0%B8%97%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A5%E0%B8%B2%E0%B8%94:%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%A4%E0%B8%94%E0%B8%B9%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86(%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%A1%E0%B8%A7%E0%B8%B1%E0%B8%99).webp" alt="Promotion" />
            <div className="top-promo-text">
              <h3>ล็อกอินเพื่อรับสิทธิประโยชน์มากยิ่งขึ้น!</h3>
              <ul>
                <li>รับประกันราคาที่ดีที่สุดเมื่อจอง</li>
                <li>รับข้อเสนอที่ดีที่สุดสำหรับสมาชิกและลูกค้า VIP</li>
                <li>รับ TripOnTour เมื่อใช้เป็นส่วนลดในการจอง</li>
                <li>สะสมยอดจองเพื่อรับสถานะลูกค้า VIP ของโกทัวร์</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};



export default TopMenu;
