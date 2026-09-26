import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from "react"
import ChatSection from "./components/chatSection/ChatSection"
import Seperation from "./components/seperation/Seperation"
import Sidebar from "./components/Sidebar/Sidebar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Admin from "./pages/Admin"
import { AuthContext } from "./context/AuthContext"

function ChatApp() {
  return (
    <div className="chatbot-container" style={{ display: 'flex', width: '100%', height: '100vh' }}>
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
