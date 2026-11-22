import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, CheckCheck, Circle, Clock3, Filter, ListTodo, LogOut, Plus, Search, SquarePen, Trash2, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api, { getData } from "../services/api";
import TaskModal from "../components/TaskModal";

const statuses = ["all", "pending", "in-progress", "completed"];
const labelStatus = (s) => s === "in-progress" ? "In progress" : s[0].toUpperCase()+s.slice(1);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks,setTasks]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [filter,setFilter]=useState("all"); const [search,setSearch]=useState(""); const [modal,setModal]=useState(false); const [editing,setEditing]=useState(null); const [saving,setSaving]=useState(false);
  const loadTasks=useCallback(async()=>{setLoading(true);setError("");try{const result=getData(await api.get("/tasks"));setTasks(Array.isArray(result)?result:[]);}catch(err){setError(err.response?.data?.error||"Could not load tasks. Check that your backend is running.");}finally{setLoading(false);}},[]);
  useEffect(()=>{loadTasks();},[loadTasks]);

  const counts=useMemo(()=>({all:tasks.length,pending:tasks.filter(t=>t.status==="pending").length,"in-progress":tasks.filter(t=>t.status==="in-progress").length,completed:tasks.filter(t=>t.status==="completed").length}),[tasks]);
  const visible=useMemo(()=>tasks.filter(t=>(filter==="all"||t.status===filter)&&`${t.title} ${t.description||""}`.toLowerCase().includes(search.toLowerCase())),[tasks,filter,search]);

  const saveTask=async(data)=>{setSaving(true);try{if(editing){const result=getData(await api.patch(`/tasks/${editing._id}`,data));setTasks(old=>old.map(t=>t._id===editing._id?result:t));}else{const result=getData(await api.post("/tasks",data));setTasks(old=>[result,...old]);}setEditing(null);}finally{setSaving(false);}};
  const editTask=(task)=>{setEditing(task);setModal(true);};
  const closeModal=()=>{setModal(false);setEditing(null);};
  const removeTask=async(task)=>{if(!window.confirm(`Delete "${task.title}"?`))return;try{await api.delete(`/tasks/${task._id}`);setTasks(old=>old.filter(t=>t._id!==task._id));}catch(err){setError(err.response?.data?.error||"Could not delete task.");}};
  const changeStatus=async(task,status)=>{try{const result=getData(await api.patch(`/tasks/${task._id}`,{status}));setTasks(old=>old.map(t=>t._id===task._id?result:t));}catch(err){setError(err.response?.data?.error||"Could not update task.");}};

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><ListTodo size={21}/></span> taskflow</div>
      <div className="side-label">WORKSPACE</div>
      <button className="side-link active"><ListTodo size={18}/> My tasks</button>
      <div className="side-bottom"><div className="user-chip"><div className="avatar">{(user?.name||"U").slice(0,1).toUpperCase()}</div><div className="user-info"><strong>{user?.name||"User"}</strong><span>{user?.email}</span></div></div><button className="side-link logout" onClick={logout}><LogOut size={18}/> Sign out</button></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>My tasks</h1></div><button className="btn btn-primary" onClick={()=>{setEditing(null);setModal(true);}}><Plus size={18}/> New task</button></header>
      <section className="welcome-row"><div><h2>Good to see you, {user?.name?.split(" ")[0]||"there"} <span>✦</span></h2><p className="muted">A little progress each day adds up.</p></div><div className="date-pill"><Clock3 size={15}/>{new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</div></section>
      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><ListTodo size={19}/></div><span>Total tasks</span><strong>{counts.all}</strong><small>In your workspace</small></div>
        <div className="stat-card"><div className="stat-icon amber"><Circle size={19}/></div><span>Pending</span><strong>{counts.pending}</strong><small>Waiting to be started</small></div>
        <div className="stat-card"><div className="stat-icon blue"><Clock3 size={19}/></div><span>In progress</span><strong>{counts["in-progress"]}</strong><small>Currently underway</small></div>
        <div className="stat-card"><div className="stat-icon green"><CheckCheck size={19}/></div><span>Completed</span><strong>{counts.completed}</strong><small>Nicely done</small></div>
      </section>
      <section className="tasks-section">
        <div className="section-head"><div><h2>All tasks</h2><p className="muted">Keep track of what needs your attention.</p></div><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."/>{search&&<button onClick={()=>setSearch("")}><X size={14}/></button>}</div></div>
        <div className="filter-row"><div className="filter-title"><Filter size={15}/> Filter</div>{statuses.map(s=><button key={s} className={`filter-chip ${filter===s?"selected":""}`} onClick={()=>setFilter(s)}>{s==="all"?"All tasks":labelStatus(s)} <span>{counts[s]}</span></button>)}</div>
        {error&&<div className="inline-error error-banner">{error}<button onClick={()=>setError("")}><X size={15}/></button></div>}
        {loading?<div className="empty-state"><div className="loader"/><p>Loading your tasks...</p></div>:visible.length===0?<div className="empty-state"><div className="empty-icon"><CheckCheck size={25}/></div><h3>{search?"No matching tasks":"Nothing on your list yet"}</h3><p>{search?"Try another search term.":"Create your first task and start making progress."}</p>{!search&&<button className="btn btn-primary" onClick={()=>setModal(true)}><Plus size={17}/> Create your first task</button>}</div>:<div className="task-list">{visible.map(task=><article className={`task-card ${task.status==="completed"?"is-complete":""}`} key={task._id}>
          <button className={`task-check ${task.status==="completed"?"checked":""}`} title="Mark completed" onClick={()=>changeStatus(task,task.status==="completed"?"pending":"completed")}>{task.status==="completed"?<Check size={15}/>:<span/>}</button>
          <div className="task-main"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority priority-${task.priority}`}>{task.priority}</span></div>{task.description&&<p>{task.description}</p>}<div className="task-meta"><span className={`status status-${task.status}`}>{labelStatus(task.status)}</span>{task.dueDate&&<span className="due-date"><Clock3 size={13}/>Due {new Date(task.dueDate).toLocaleDateString()}</span>}</div></div>
          <div className="task-actions"><button className="icon-btn" title="Edit task" onClick={()=>editTask(task)}><SquarePen size={16}/></button><button className="icon-btn danger-hover" title="Delete task" onClick={()=>removeTask(task)}><Trash2 size={16}/></button></div>
        </article>)}</div>}
      </section>
      <footer className="dashboard-footer">TASKFLOW <span>·</span> STAY FOCUSED. KEEP MOVING.</footer>
    </main>
    <TaskModal open={modal} task={editing} onClose={closeModal} onSave={saveTask} saving={saving}/>
  </div>;
}