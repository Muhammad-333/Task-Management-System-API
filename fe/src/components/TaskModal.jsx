import { useEffect, useState } from "react";
import { X } from "lucide-react";

const empty = { title: "", description: "", status: "pending", priority: "medium", dueDate: "" };

export default function TaskModal({ open, onClose, onSave, task, saving }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(task ? {
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
      } : empty);
      setError("");
    }
  }, [open, task]);

  if (!open) return null;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Please enter a task title.");
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        ...(form.dueDate ? { dueDate: new Date(`${form.dueDate}T12:00:00`).toISOString() } : {}),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Could not save this task. Please try again.");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal">
        <div className="modal-head"><div><span className="eyebrow">{task ? "UPDATE TASK" : "NEW TASK"}</span><h2>{task ? "Edit task" : "Create a task"}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X/></button></div>
        <form onSubmit={submit} className="form-stack">
          <label>Task title<input name="title" value={form.title} onChange={change} maxLength="100" placeholder="e.g. Finish project documentation" autoFocus required /></label>
          <label>Description <span className="optional">OPTIONAL</span><textarea name="description" value={form.description} onChange={change} maxLength="1000" rows="3" placeholder="Add a few details..." /></label>
          <div className="form-grid">
            <label>Status<select name="status" value={form.status} onChange={change}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label>
            <label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          </div>
          <label>Due date <span className="optional">OPTIONAL</span><input type="date" name="dueDate" value={form.dueDate} onChange={change}/></label>
          {error && <div className="inline-error">{error}</div>}
          <div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</button></div>
        </form>
      </section>
    </div>
  );
}