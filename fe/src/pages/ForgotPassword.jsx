import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

export default function ForgotPassword() {
  const [email,setEmail]=useState(""); const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false); const navigate=useNavigate();
  const submit=async(e)=>{e.preventDefault();setBusy(true);setError("");try{await api.post("/auth/forgot-password",{email});setMessage("Reset code sent. Check your email.");navigate("/reset-password",{state:{email}});}catch(err){setError(err.response?.data?.error||"Could not send reset code.");}finally{setBusy(false);}};
  return <AuthLayout title="Forgot your password?" subtitle="We'll send a one-time code to your registered email.">
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label>
      {error&&<div className="inline-error">{error}</div>}
      <button className="btn btn-primary btn-full" disabled={busy}>{busy?"Sending...":"Send reset code"}</button>
    </form>
    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
  </AuthLayout>;
}