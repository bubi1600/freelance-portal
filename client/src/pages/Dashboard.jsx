import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Copy, ChevronDown, ChevronUp, LogOut, Users } from 'lucide-react';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', projectName: '' });
  const [updateText, setUpdateText] = useState('');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    const res = await axios.get('http://localhost:5000/api/clients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setClients(res.data);
  };

  const createClient = async () => {
    await axios.post('http://localhost:5000/api/clients', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ name: '', email: '', projectName: '' });
    setShowForm(false);
    fetchClients();
  };

  const postUpdate = async () => {
    await axios.post(`http://localhost:5000/api/clients/${selected._id}/updates`, { text: updateText }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUpdateText('');
    fetchClients();
  };

  const copyPortalLink = (slug) => {
    navigator.clipboard.writeText(`http://localhost:5173/portal/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!token) { window.location.href = '/'; return null; }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>FreelancePortal</h1>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Your Clients</h2>
            <p style={{ color: '#64748b', margin: 0 }}>{clients.length} active portal{clients.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            <Plus size={18} /> New Client
          </button>
        </div>

        {/* Add Client Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Add New Client</h3>
            <input placeholder="Client Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="Client Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input placeholder="Project Name" value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={createClient} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Create Portal
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#64748b' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {clients.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <Users size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ color: '#0f172a', marginBottom: '8px' }}>No clients yet</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Create your first client portal to get started</p>
            <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Add Your First Client
            </button>
          </div>
        )}

        {/* Client Cards */}
        {clients.map(client => (
          <div key={client._id} style={{ background: 'white', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{client.name}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>{client.projectName}</p>
                <span style={{ display: 'inline-block', padding: '2px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                  {client.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => copyPortalLink(client.slug)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: copied === client.slug ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: copied === client.slug ? '#16a34a' : '#374151' }}
                >
                  <Copy size={14} /> {copied === client.slug ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => setSelected(selected?._id === client._id ? null : client)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                >
                  {selected?._id === client._id ? <><ChevronUp size={14} /> Close</> : <><ChevronDown size={14} /> Manage</>}
                </button>
              </div>
            </div>

            {selected?._id === client._id && (
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '24px' }}>
                <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Post an Update</h5>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <input
                    placeholder="e.g. Finished homepage design, moving to mobile..."
                    value={updateText}
                    onChange={e => setUpdateText(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                  <button onClick={postUpdate} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Post
                  </button>
                </div>

                <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Updates</h5>
                {client.updates.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>No updates posted yet.</p>}
                {client.updates.map((u, i) => (
                  <div key={i} style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', borderLeft: '3px solid #6366f1' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a' }}>{u.text}</p>
                    <small style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(u.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;