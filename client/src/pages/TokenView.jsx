import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TokenView = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const fetch = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/token');
            setData(res.data.data); toast.success('Token loaded!');
        } catch (err) {
            if (err.response?.status === 401) { toast.error('Session expired'); navigate('/login'); return; }
            toast.error(err.response?.data?.message || 'Failed.');
        } finally { setLoading(false); }
    };

    const copy = () => { if (data?.token) { navigator.clipboard.writeText(data.token); toast.success('Copied!'); } };
    const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const remaining = () => {
        if (!data?.expiry) return null;
        const r = new Date(data.expiry) - new Date();
        if (r <= 0) return '⚠ Expired';
        return `${Math.floor(r / 3600000)}h ${Math.floor((r % 3600000) / 60000)}m`;
    };

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            <div style={{ maxWidth: '540px', width: '100%' }}>
                <div className="animate-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.3rem' }}>
                        Session <span className="shimmer-text">Token</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your JWT authentication details</p>
                </div>

                {!data ? (
                    <div className="card animate-slam" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div className="animate-float animate-glow" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Load your JWT session token</p>
                        <button className="btn-primary" onClick={fetch} disabled={loading} style={{ padding: '12px 30px' }}>
                            {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}></span>Loading...</> : '⚡ Load Token'}
                        </button>
                    </div>
                ) : (
                    <div className="modal-bg" onClick={() => setData(null)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h2 className="heading-sub" style={{ fontSize: '1.2rem' }}>🔑 JWT Token</h2>
                                <button onClick={() => setData(null)} style={{ background: 'rgba(232,64,87,0.06)', border: '1px solid rgba(232,64,87,0.15)', color: 'var(--accent-soft)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '6px' }}>
                                <MiniBtn onClick={() => setShow(!show)} color="var(--cyan)">{show ? '🔒 Hide' : '👁 Show'}</MiniBtn>
                                <MiniBtn onClick={copy} color="var(--gold)">📋 Copy</MiniBtn>
                            </div>
                            <div className="token-mono">{show ? data.token : data.maskedToken}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', background: 'rgba(255,255,255,0.015)', padding: '0.75rem', borderRadius: '8px' }}>
                                <Detail label="User ID" value={data.uid?.substring(0, 12) + '...'} />
                                <Detail label="Expires" value={fmtDate(data.expiry)} />
                                <Detail label="Created" value={fmtDate(data.createdAt)} />
                                <Detail label="Remaining" value={remaining()} hl />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                                <button className="btn-secondary" onClick={fetch} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>↻ Refresh</button>
                                <button className="btn-primary" onClick={() => setData(null)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="animate-in delay-2" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>← Back</button>
                </div>
            </div>
        </div>
    );
};

const MiniBtn = ({ onClick, color, children }) => (
    <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color, padding: '3px 8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', borderRadius: '5px', transition: 'all 0.2s' }}>{children}</button>
);

const Detail = ({ label, value, hl }) => (
    <div><p className="fx-label" style={{ marginBottom: '2px' }}>{label}</p><p style={{ color: hl ? 'var(--accent)' : 'var(--text-primary)', fontSize: '0.82rem', fontWeight: hl ? '700' : '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p></div>
);

export default TokenView;
