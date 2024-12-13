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
import BookAppointment from "../pages/patient/BookAppointment";
import TermsPrivacyPage from "../pages/public/TermsPrivacyPage";
import ProtectedRoute from '../components/auth/protectedRoute';
import AppointmentHistory from "../pages/patient/AppointmentHistory";
import HealthRecords from "../pages/patient/HealthRecords";
import AdminDoctors from "../pages/admin/AdminDoctors";
import DoctorAppointments from "../pages/doctor/doctorAppointments";
import DoctorChats from "../pages/doctor/DoctorChats";
import AdminInvoices from "../pages/admin/AdminInvoices";
import AdminPatients from "../pages/admin/AdminPatients";
import BlogListPage from "../pages/blog/BlogListPage"; 
import BlogDetailPage from "../pages/blog/BlogDetailPage"; 
import PatientInvoices from "../pages/patient/PatientInvoices";

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* Protected Routes */}
      <Route
        path="/dashboard/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/doctor/chats"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorChats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/doctor/appointments"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/patients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/invoices"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInvoices />
          </ProtectedRoute>
        }
      />
      <Route 
      path ="/dashboard/patient/book" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <BookAppointment />
          </ProtectedRoute>
        } 
      />
            <Route 
      path ="/dashboard/patient/invoices" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <PatientInvoices />
          </ProtectedRoute>
        } 
      />
      <Route 
      path ="/dashboard/patient/history" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <AppointmentHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
      path ="/dashboard/patient/records" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <HealthRecords />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Error404Page />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path ="/blog" element={<BlogListPage />} />
      <Route path ="/blog/:id" element={<BlogDetailPage />}/>
      <Route path ="/terms-and-privacy" element={<TermsPrivacyPage />} />
    </Routes>
);

export default AppRoutes;
