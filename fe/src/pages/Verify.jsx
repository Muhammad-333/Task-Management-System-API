import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

export default function Verify() {
  const location = useLocation(); const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState(""); const [message, setMessage] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await api.post("/auth/verify", { email, code }); setMessage("Email verified. You can now sign in."); setTimeout(()=>navigate("/login"), 900); }
    catch (err) { setError(err.response?.data?.error || "Verification failed."); }
    finally { setBusy(false); }
  };
  const resend = async () => {
    setError(""); setMessage("");
    try { await api.post("/auth/resend", { email }); setMessage("A new verification code has been sent."); }
    catch (err) { setError(err.response?.data?.error || "Could not resend code."); }
  };
  return <AuthLayout title="Verify your email" subtitle="Enter the six-digit code sent to your email address.">
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Verification code<input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" required/></label>
      {error && <div className="inline-error">{error}</div>}{message && <div className="inline-success">{message}</div>}
      <button className="btn btn-primary btn-full" disabled={busy || code.length!==6}>{busy ? "Verifying..." : "Verify email"}</button>
      <button type="button" className="text-btn" onClick={resend}>Resend verification code</button>
    </form>
    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
  </AuthLayout>;
}