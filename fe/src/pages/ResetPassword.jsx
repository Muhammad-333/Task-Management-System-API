import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

export default function ResetPassword() {
  const location=useLocation();const navigate=useNavigate();const [email,setEmail]=useState(location.state?.email||"");const [code,setCode]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
  const submit=async(e)=>{e.preventDefault();setBusy(true);setError("");try{await api.post("/auth/reset-password",{email,code,password});setMessage("Password reset successfully.");setTimeout(()=>navigate("/login"),1000);}catch(err){setError(err.response?.data?.error||"Could not reset password.");}finally{setBusy(false);}};
  return <AuthLayout title="Set a new password" subtitle="Enter the code from your email and choose a new password.">
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Reset code<input className="otp-input" inputMode="numeric" maxLength="6" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" required/></label>
      <label>New password<input type="password" minLength="12" maxLength="72" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 12 characters" required/></label>
      {error&&<div className="inline-error">{error}</div>}{message&&<div className="inline-success">{message}</div>}
      <button className="btn btn-primary btn-full" disabled={busy}>{busy?"Updating...":"Reset password"}</button>
    </form>
    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
  </AuthLayout>;
}