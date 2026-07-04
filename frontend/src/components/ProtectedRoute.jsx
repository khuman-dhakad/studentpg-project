import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // 1. Apne LocalStorage ya Auth Context se logged-in user ka data nikalo
const { user } = useAuth();
const token = localStorage.getItem("token"); // Maan lete hain user object me role saved hai

  // 2. Agar login hi nahi hai, toh login page par bhej do
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar logged in hai lekin role ADMIN nahi hai, toh access mat do (unauthorized page ya home par bhej do)
  if (user.role !== 'ADMIN') {
   console.warn("Unauthorized access attempt caught by security filter.");
    
    return <Navigate to="/" replace />;
  }

  // 4. Agar token sahi hai aur role ADMIN hai, toh page dikhao
  return children;
}