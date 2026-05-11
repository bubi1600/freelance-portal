import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Portal() {
  const { slug } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/clients/portal/${slug}`)
      .then(res => setClient(res.data))
      .catch(() => setError('Portal not found'));
  }, [slug]);

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a' }}>Portal not found</h2>
        <p style={{ color: '#64748b' }}>This link may be invalid or expired.</p>
      </div>
    </div>
  );

  if (!client) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#64748b' }}>Loading your portal...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>FreelancePortal</h1>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Client Portal</span>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Project Header */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '500', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</p>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{client.projectName}</h2>
          <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>Client: {client.name}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f0fdf4', borderRadius: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#16a34a' }}>{client.status}</span>
          </div>
        </div>

        {/* Updates */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Project Updates</h3>
          {client.updates.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No updates have been posted yet.</p>
          )}
          {client.updates.map((u, i) => (
            <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '10px', borderLeft: '3px solid #6366f1' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>{u.text}</p>
              <small style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
            </div>
          ))}
        </div>

        {/* Invoice */}
        {client.invoice?.amount && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Invoice</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>€{client.invoice.amount}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Due: {new Date(client.invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500', background: client.invoice.paid ? '#f0fdf4' : '#fef9c3', color: client.invoice.paid ? '#16a34a' : '#ca8a04' }}>
                {client.invoice.paid ? '✅ Paid' : '⏳ Unpaid'}
              </span>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: '#cbd5e1' }}>
          Powered by FreelancePortal
        </p>
      </div>
    </div>
  );
}

export default Portal;