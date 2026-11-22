import { CheckCircle2, ListTodo, ShieldCheck, Zap } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="brand"><span className="brand-mark"><ListTodo size={21}/></span> taskflow</div>
        <div className="visual-copy">
          <span className="eyebrow">MAKE EVERY DAY COUNT</span>
          <h1>Less chaos.<br/><span>More progress.</span></h1>
          <p>A focused space to plan your work, keep priorities clear, and get things done.</p>
          <div className="visual-points">
            <div><CheckCircle2 size={17}/> Keep every task in one place</div>
            <div><ShieldCheck size={17}/> Your tasks stay private</div>
            <div><Zap size={17}/> Build momentum every day</div>
          </div>
        </div>
        <div className="visual-bottom">YOUR WORKSPACE, YOUR WAY.</div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand"><span className="brand-mark"><ListTodo size={20}/></span> taskflow</div>
          <span className="eyebrow">WELCOME TO TASKFLOW</span>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
          {footer}
        </div>
      </section>
    </main>
  );
}