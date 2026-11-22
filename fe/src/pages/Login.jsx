import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(form); navigate("/dashboard", { replace: true }); }
    catch (err) { setError(err.response?.data?.error || "Login failed. Check your details and try again."); }
    finally { setBusy(false); }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to pick up where you left off.">
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label>
      <label>Password<input type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label>
      <div className="form-extra"><span></span><Link to="/forgot-password">Forgot password?</Link></div>
      {error && <div className="inline-error">{error}</div>}
      <button className="btn btn-primary btn-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
    <p className="auth-switch">New to Taskflow? <Link to="/signup">Create an account</Link></p>
  </AuthLayout>;
}