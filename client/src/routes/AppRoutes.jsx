// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/public/HomePage";
import AboutUsPage from "../pages/public/AboutUsPage";
import ContactUsPage from "../pages/public/ContactUsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import PatientDashboard from "../pages/dashboard/PatientDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Error404Page from "../pages/errors/404ErrorPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import BlogPage from "../pages/public/BlogPage";

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard/patient" element={<PatientDashboard />} />
      <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Error404Page />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path ="/blog" element={<BlogPage />} />
    </Routes>
);

export default AppRoutes;
