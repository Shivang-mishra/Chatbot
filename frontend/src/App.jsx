import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useState, useEffect } from "react"
import ChatSection from "./components/chatSection/ChatSection"
import Seperation from "./components/seperation/Seperation"
import Sidebar from "./components/Sidebar/Sidebar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Admin from "./pages/Admin"
import { AuthContext } from "./context/AuthContext"

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {message}
    </div>
  );
}

function ChatApp() {
  return (
    <div className="chatbot-container">
      <Sidebar/>
      <Seperation/>
      <ChatSection/>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

import Settings from "./pages/Settings"

function App() {
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const handleToast = (e) => setToastMessage(e.detail);
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/" element={<ChatApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </>
  )
}

export default App
