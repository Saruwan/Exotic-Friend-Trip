import React from "react";
import { FaFacebook, FaLine, FaApple } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

const SocialLogin = ({ closeModal }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login:", user);
      closeModal();
    } catch (error) {
      console.error("Error with Google Login:", error);
    }
  };

  return (
    <div className="social-login">
      <button onClick={handleGoogleLogin} className="social-btn google">Google</button>
      <button className="social-btn facebook"><FaFacebook /> Facebook</button>
      <button className="social-btn line"><FaLine /> Line</button>
      <button className="social-btn apple"><FaApple /> Apple</button>
    </div>
  );
};

export default SocialLogin;
