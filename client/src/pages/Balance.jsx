import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const navigate = useNavigate();

    const fire = () => {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.65 }, colors: ['#e84057', '#ffc857', '#5ce0d8', '#a78bfa', '#fff'], zIndex: 9999 });
        setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.55 }, colors: ['#ffc857', '#fff'], zIndex: 9999 }), 400);
    };

    const fetch = async () => {
        setLoading(true); setRevealed(false);
        try {
            const res = await api.get('/api/balance');
            setBalance(res.data.data.balance); setUserData(res.data.data);
            setRevealed(true); toast.success('Balance loaded!'); setTimeout(fire, 300);
        } catch (err) {
            if (err.response?.status === 401) { toast.error('Session expired'); navigate('/login'); return; }
            toast.error(err.response?.data?.message || 'Failed to load balance.');
        } finally { setLoading(false); }
    };

    const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                <div className="animate-in" style={{ marginBottom: '1.5rem' }}>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.3rem' }}>
                        Account <span className="shimmer-text">Balance</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View your current funds</p>
                </div>

                <div className={`card animate-slam ${revealed ? 'animate-pulse-glow' : ''}`} style={{ padding: '2.25rem', marginBottom: '1rem' }}>
                    {!revealed ? (
                        <>
                            <div className="animate-float animate-glow" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.25rem' }}>Tap to reveal your balance</p>
                            <button className="btn-gold" onClick={fetch} disabled={loading} style={{ padding: '14px 36px' }}>
                                {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', borderTopColor: '#1a1800', borderColor: 'rgba(0,0,0,0.1)' }}></span>Loading...</> : '⚡ Reveal Balance'}
                            </button>
                        </>
                    ) : (
                        <div className="animate-reveal">
                            <p className="fx-label" style={{ marginBottom: '0.4rem' }}>Available Balance</p>
                            <p className="heading-manga shimmer-text" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', lineHeight: '1.1', marginBottom: '1.25rem' }}>
                                {fmt(balance)}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                <Info label="Name" value={userData?.username} />
                                <Info label="Email" value={userData?.email} />
                                <Info label="Role" value={userData?.role} />
                                <Info label="ID" value={userData?.uid?.substring(0, 8) + '...'} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'center' }}>
                                <button className="btn-secondary" onClick={fetch} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>↻ Refresh</button>
                                <button className="btn-primary" onClick={() => navigate('/transfer')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Send Money →</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div><p className="fx-label" style={{ marginBottom: '2px' }}>{label}</p><p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p></div>
);

export default Balance;
