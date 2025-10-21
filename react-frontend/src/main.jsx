import React,{useEffect,useState} from 'react'; import { createRoot } from 'react-dom/client';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'secret123';
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081';
function App(){
  const [base,setBase]=useState(DEFAULT_BASE); const [leads,setLeads]=useState([]);
  const [form,setForm]=useState({name:'',email:'',phone:'',company:'',source:'',notes:''});
  const [start,setStart]=useState(''); const [end,setEnd]=useState('');
  const headers={'Authorization':`Bearer ${API_TOKEN}`,'Content-Type':'application/json'};
  const load=async()=>{ let url=`${base}/leads`; if(start&&end) url+=`?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`; const r=await fetch(url,{headers:{'Authorization':`Bearer ${API_TOKEN}`}}); setLeads(await r.json()); };
  useEffect(()=>{ load(); },[base]);
  return (<div style={{fontFamily:'system-ui',padding:16,maxWidth:960,margin:'0 auto'}}>
    <h1>Leads</h1>
    <div style={{display:'flex',gap:8}}>
      <input value={base} onChange={e=>setBase(e.target.value)} placeholder="API base (Java 8081 / PHP 8082)" style={{flex:1}}/>
      <button onClick={load}>Refresh</button>
    </div>
    <h3>Add Lead</h3>
    <form onSubmit={async e=>{e.preventDefault(); await fetch(`${base}/leads`,{method:'POST',headers,body:JSON.stringify(form)}); setForm({name:'',email:'',phone:'',company:'',source:'',notes:''}); load();}} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
      <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      <input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
      <input placeholder="Source" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}/>
      <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{gridColumn:'1/3',minHeight:60}}/>
      <button type="submit" style={{gridColumn:'1/3'}}>Save</button>
    </form>
    <h3 style={{marginTop:24}}>Report by Date</h3>
    <div style={{display:'flex',gap:8}}>
      <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/>
      <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/>
      <button onClick={load}>Run Report</button>
    </div>
    <table style={{width:'100%',marginTop:12,borderCollapse:'collapse'}}>
      <thead><tr><th>Created</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Source</th><th>Notes</th><th>Actions</th></tr></thead>
      <tbody>{leads.map(l=>(<tr key={l.id} style={{borderTop:'1px solid #eee'}}>
        <td>{l.createdAt||l.created_at}</td>
        <td><input value={l.name||''} onChange={e=>{l.name=e.target.value; setLeads([...leads]);}}/></td>
        <td><input value={l.email||''} onChange={e=>{l.email=e.target.value; setLeads([...leads]);}}/></td>
        <td><input value={l.phone||''} onChange={e=>{l.phone=e.target.value; setLeads([...leads]);}}/></td>
        <td><input value={l.company||''} onChange={e=>{l.company=e.target.value; setLeads([...leads]);}}/></td>
        <td><input value={l.source||''} onChange={e=>{l.source=e.target.value; setLeads([...leads]);}}/></td>
        <td><input value={l.notes||''} onChange={e=>{l.notes=e.target.value; setLeads([...leads]);}}/></td>
        <td><button onClick={async()=>{await fetch(`${base}/leads/${l.id}`,{method:'PUT',headers,body:JSON.stringify(l)}); load();}}>Update</button>
            <button onClick={async()=>{await fetch(`${base}/leads/${l.id}`,{method:'DELETE',headers}); load();}} style={{marginLeft:6}}>Delete</button></td>
      </tr>))}</tbody>
    </table>
  </div>); }
createRoot(document.getElementById('root')).render(<App/>);
