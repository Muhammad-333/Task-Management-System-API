import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api, { getData } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      await api.post("/auth/signup", form);
      navigate("/verify", { state: { email: form.email } });
    } catch (err) { setError(err.response?.data?.error || "Could not create your account."); }
    finally { setBusy(false); }
  };
  return <AuthLayout title="Create your account" subtitle="Start organizing your work with a little more clarity.">
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" minLength="2" maxLength="80" required/></label>
      <label>Email address<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/></label>
      <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 12 characters" minLength="12" maxLength="72" required/><small>Use at least 12 characters.</small></label>
      {error && <div className="inline-error">{error}</div>}
      <button className="btn btn-primary btn-full" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthLayout>;
}