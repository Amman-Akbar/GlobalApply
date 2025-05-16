import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './components/Navbar';
import CursorFollower from './components/CursorFollower';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Institutes from './pages/Institutes';
import InstituteDetail from './pages/InstituteDetail'; // Import the new detail page
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import RegisterInstitute from './pages/RegisterInstitute';
import StudentDashboard from './pages/StudentDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PannellumViewer from './pages/PannellumViewer';
import StudentDetailForm from './pages/StudentDetailForm';
import { UserProvider } from './context/UserContext';
import Chatbot from './components/Chatbot'; // Chatbot component
import Pricing from './pages/Pricing';

const App = () => {
  const location = useLocation(); // Get the current route
  const [showChatbot, setShowChatbot] = useState(false); // State to toggle chatbot

  // Paths where Navbar and Footer should not be displayed
  const noNavFooterRoutes = ['/student-dashboard', '/institute-dashboard', '/admin','/vt'];

  const shouldHideNavFooter = noNavFooterRoutes.includes(location.pathname);

  return (
    <>
      <UserProvider>
      {!shouldHideNavFooter && <Navbar />}
      <CursorFollower />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path='/vt' element={<PannellumViewer />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/institutes" element={<Institutes />} />
        <Route path="/institutes/detail/:id" element={<InstituteDetail />} /> {/* New route for detail page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register-institute" element={<RegisterInstitute />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/institute-dashboard" element={<InstituteDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student-detail" element={<StudentDetailForm />} />
      </Routes>
      {!shouldHideNavFooter && <Footer />}

      {/* Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-700 z-30 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg focus:outline-none"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        💬
      </button>

      {/* Chatbot Interface */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </UserProvider>
    </>
  );
};

export default App;
