import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Success from './pages/Success';
import Failure from './pages/Failure';
import AdminDashboard from './pages/AdminDashboard';
import AddStudent from './pages/AddStudent';
import StudentDetails from './pages/StudentDetails';
import AdminLogin from './pages/AdminLogin';
import AdminSettings from './pages/AdminSettings';
import DiplomaInternshipForm from './pages/DiplomaInternshipForm';
import AdminDiplomaInternship from './pages/AdminDiplomaInternship';
import DiplomaInternshipDetails from './pages/DiplomaInternshipDetails';
import DiplomaInternshipSuccess from './pages/DiplomaInternshipSuccess';
import BtechInternshipForm from './pages/BtechInternshipForm';
import AdminBtechInternship from './pages/AdminBtechInternship';
import BtechInternshipDetails from './pages/BtechInternshipDetails';
import BtechInternshipSuccess from './pages/BtechInternshipSuccess';
import NotFound from './pages/NotFound';




// Simple "auth" check
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isSVAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/diploma-internship" element={<DiplomaInternshipForm />} />
        <Route path="/diploma-internship/success" element={<DiplomaInternshipSuccess />} />
        <Route path="/btech-internship" element={<BtechInternshipForm />} />
        <Route path="/btech-internship/success" element={<BtechInternshipSuccess />} />
        <Route path="/success" element={<Success />} />


        <Route path="/failure" element={<Failure />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/diploma-internship" element={
          <ProtectedRoute>
            <AdminDiplomaInternship />
          </ProtectedRoute>
        } />

        <Route path="/admin/diploma-internship/:id" element={
          <ProtectedRoute>
            <DiplomaInternshipDetails />
          </ProtectedRoute>
        } />

        <Route path="/admin/btech-internship" element={
          <ProtectedRoute>
            <AdminBtechInternship />
          </ProtectedRoute>
        } />

        <Route path="/admin/btech-internship/:id" element={
          <ProtectedRoute>
            <BtechInternshipDetails />
          </ProtectedRoute>
        } />



        <Route path="/admin/add-student" element={
          <ProtectedRoute>
            <AddStudent />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/student/:id" element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
