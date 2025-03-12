import React, { createContext, useContext, useState } from 'react';

// สร้าง Context สำหรับข้อมูลการล็อคอิน
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ข้อมูลการล็อคอิน

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
