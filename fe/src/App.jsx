import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { token } = useAuth();
  return <Routes>
    <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace/>}/>
    <Route path="/login" element={token?<Navigate to="/dashboard" replace/>:<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/verify" element={<Verify/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="/reset-password" element={<ResetPassword/>}/>
    <Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<Dashboard/>}/></Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}