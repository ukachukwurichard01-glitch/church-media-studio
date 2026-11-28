import React, { useEffect, useMemo, useState } from "react";

const STARTER = [
  ["Opening Prayer", "Prayer", 5],
  ["Praise and Worship", "Worship", 20],
  ["Opening Scripture", "Bible", 5],
  ["Choir Ministration", "Music", 10],
  ["Special Ministration", "Presentation", 10],
  ["Sermon / Word", "Preacher", 45],
  ["Offering and Tithes", "Offering", 10],
  ["Church Announcements", "Announcement", 5],
  ["Closing Prayer and Benediction", "Prayer", 5]
];

function loadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem("cms-service-plan-v1") || "null");
    return saved && Array.isArray(saved.items) ? saved : {
      title: "Sunday Worship Service",
      date: new Date().toISOString().slice(0, 10),
      items: STARTER.map((x, i) => ({ id: "service-" + i, title: x[0], type: x[1], minutes: x[2], notes: "" }))
    };
  } catch {
    return { title: "Sunday Worship Service", date: new Date().toISOString().slice(0, 10), items: [] };
  }
}

export default function ServicePlanner({ onSendLive }) {
  const [plan, setPlan] = useState(loadPlan);
  const [draft, setDraft] = useState({ title: "", type: "Other", minutes: 5, notes: "" });
  const total = useMemo(() => plan.items.reduce((sum, item) => sum + (Number(item.minutes) || 0), 0), [plan.items]);
  useEffect(() => { localStorage.setItem("cms-service-plan-v1", JSON.stringify(plan)); }, [plan]);
  const patch = (key, value) => setPlan(p => ({ ...p, [key]: value }));
  const addItem = () => {
    if (!draft.title.trim()) return;
    setPlan(p => ({ ...p, items: [...p.items, { ...draft, id: "service-" + Date.now(), minutes: Math.max(0, Number(draft.minutes) || 0) }] }));
    setDraft({ title: "", type: "Other", minutes: 5, notes: "" });
  };
  const move = (index, delta) => setPlan(p => {
    const items = [...p.items], next = index + delta;
    if (next < 0 || next >= items.length) return p;
    [items[index], items[next]] = [items[next], items[index]];
    return { ...p, items };
  });
  const remove = id => setPlan(p => ({ ...p, items: p.items.filter(item => item.id !== id) }));
  const reset = () => setPlan({ title: "Sunday Worship Service", date: new Date().toISOString().slice(0, 10), items: STARTER.map((x, i) => ({ id: "service-" + Date.now() + "-" + i, title: x[0], type: x[1], minutes: x[2], notes: "" })) });
  return <section className="content-panel production-panel service-planner">
    <div className="panel-heading"><div><h2>Church Service Planner</h2><p>Build, save and reuse your church's running order. Changes are saved automatically on this computer.</p></div><span className="small-label">LOCAL RUN OF SHOW</span></div>
    <div className="planner-meta">
      <label>Service name<input value={plan.title} onChange={e=>patch("title",e.target.value)} /></label>
      <label>Service date<input type="date" value={plan.date} onChange={e=>patch("date",e.target.value)} /></label>
      <div className="planner-total"><strong>{total} min</strong><span>Estimated service length</span></div>
    </div>
    <div className="settings-section">
      <h3>Add a service item</h3>
      <div className="planner-add">
        <label>Item name<input value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} placeholder="e.g. Welcome and opening prayer"/></label>
        <label>Type<select value={draft.type} onChange={e=>setDraft(d=>({...d,type:e.target.value}))}>{["Prayer","Worship","Bible","Hymn","Music","Preacher","Presentation","Announcement","Offering","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Minutes<input type="number" min="0" max="240" value={draft.minutes} onChange={e=>setDraft(d=>({...d,minutes:e.target.value}))}/></label>
        <button className="primary-btn" onClick={addItem} disabled={!draft.title.trim()}>Add to service</button>
      </div>
      <label className="planner-notes">Notes for this item<textarea value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))} placeholder="Optional notes, Bible reference, hymn number or operator instructions"/></label>
    </div>
    <div className="planner-list">
      {plan.items.map((item,index)=><article className="planner-item" key={item.id}>
        <div className="planner-number">{String(index+1).padStart(2,"0")}</div>
        <div className="planner-item-main"><span className="small-label">{item.type} · {item.minutes} MIN</span><strong>{item.title}</strong>{item.notes && <p>{item.notes}</p>}</div>
        <div className="slide-actions">
          <button className="secondary-btn" disabled={index===0} onClick={()=>move(index,-1)}>↑</button>
          <button className="secondary-btn" disabled={index===plan.items.length-1} onClick={()=>move(index,1)}>↓</button>
          <button className="primary-btn" onClick={()=>onSendLive?.(item.title, item.type.toUpperCase()+" · "+plan.title, item.type==="Bible"?"Bible":item.type==="Hymn"?"Song":item.type==="Preacher"?"Preacher Video":"Presentation")}>Prepare live</button>
          <button className="text-danger" onClick={()=>remove(item.id)}>Remove</button>
        </div>
      </article>)}
      {plan.items.length===0 && <div className="empty-state">Add your first service item above.</div>}
    </div>
    <div className="button-row"><button className="secondary-btn" onClick={reset}>Restore Sunday service template</button><span className="hint">The plan remains saved after the application closes.</span></div>
  </section>;
}
