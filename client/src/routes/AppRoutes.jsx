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
import DoctorWriteBlog from "../pages/doctor/DoctorWriteBlog";
import DoctorViewBlog from "../pages/doctor/DoctorViewBlog";
import DoctorChats from "../pages/doctor/DoctorChats";
import AdminInvoices from "../pages/admin/AdminInvoices";
import AdminPatients from "../pages/admin/AdminPatients";
import BlogListPage from "../pages/blog/BlogListPage"; 
import BlogDetailPage from "../pages/blog/BlogDetailPage"; 
import PatientInvoices from "../pages/patient/PatientInvoices";
import EditPatientAccount from "../pages/patient/EditPatientAccount";
import EditAdminAccount from "../pages/admin/EditAdminAccount";
import EditDoctorAccount from "../pages/doctor/EditDoctorAccount";
import CompleteAppointment from "../pages/doctor/CompleteAppointment";
import AppointmentInfo from "../pages/patient/AppointmentInfo";
import HealthRecordInfo from "../pages/patient/HealthRecordInfo"; 
import InvoiceInfo from "../pages/patient/InvoiceInfo";
import AdminInvoiceInfo from "../pages/admin/InvoiceInfo";
import DoctorInfo from "../pages/admin/DoctorInfo";
import PatientInfo from "../pages/admin/PatientInfo";
import AdminHealthRecords from "../pages/admin/HealthRecords";
import HashRecord from "../pages/admin/HashRecord";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import { useSelector } from 'react-redux';



const AppRoutes = () => {

    const user = useSelector((state) => state.user.userDetails);

    const getDashboardPath = () => {
      switch (user?.role) {
        case "admin":
          return "/dashboard/admin";
        case "doctor":
          return "/dashboard/doctor";
        case "patient":
          return "/dashboard/patient";
        default:
          return "/";
      }
    };

return(
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Redirect `/dashboard` to the appropriate role-based dashboard */}
      <Route
        path="/dashboard"
        element={
          user ? <Navigate to={getDashboardPath()} replace /> : <Navigate to="/login" replace />
        }
      />

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
        path="/dashboard/patient/edit"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <EditPatientAccount />
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
        path="/dashboard/doctor/history"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />
      {<Route
        path="/dashboard/doctor/edit"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <EditDoctorAccount />
          </ProtectedRoute>
        }
      /> }
      <Route
        path="/dashboard/doctor/chats"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorChats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/doctor/complete-appointment/:id"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <CompleteAppointment />
          </ProtectedRoute>
        }
      />
    <Route 
        path="/dashboard/doctor/write-blog" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorWriteBlog />
        </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard/doctor/view-blog" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorViewBlog />
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
      { <Route
        path="/dashboard/admin/edit"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EditAdminAccount />
          </ProtectedRoute>
        }
      /> }
      { <Route
        path="/dashboard/admin/hash-records"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <HashRecord />
          </ProtectedRoute>
        }
      /> }
      { <Route
        path="/dashboard/admin/health-records"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHealthRecords />
          </ProtectedRoute>
        }
      /> }
      <Route
        path="/dashboard/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/doctor/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DoctorInfo />
          </ProtectedRoute>
        }
      />
      <Route 
      path ="/dashboard/admin/invoice/:id" 
      element={
          <ProtectedRoute allowedRoles={['admin']}>
          <AdminInvoiceInfo />
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
        path="/dashboard/admin/patient/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PatientInfo />
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
      path ="/dashboard/patient/appointment/:id" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <AppointmentInfo />
          </ProtectedRoute>
        } 
      />
      <Route 
      path ="/dashboard/patient/invoice/:id" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <InvoiceInfo />
          </ProtectedRoute>
        } 
      />
      <Route 
      path ="/dashboard/patient/health-record/:id" 
      element={
          <ProtectedRoute allowedRoles={['patient']}>
          <HealthRecordInfo />
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
)};

export default AppRoutes;
