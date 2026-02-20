import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const cards = [
        { id: 'balance', icon: '💰', title: 'Check Balance', desc: 'View your current account balance', color: 'var(--gold)', border: 'rgba(255,200,87,0.18)', to: '/balance' },
        { id: 'transfer', icon: '💸', title: 'Send Money', desc: 'Transfer funds to another user', color: 'var(--green)', border: 'rgba(52,211,153,0.18)', to: '/transfer' },
        { id: 'history', icon: '📋', title: 'Transactions', desc: 'View your transaction history', color: 'var(--purple)', border: 'rgba(167,139,250,0.18)', to: '/history' },
        { id: 'token', icon: '🔑', title: 'JWT Token', desc: 'View your session token details', color: 'var(--cyan)', border: 'rgba(92,224,216,0.18)', to: '/token' },
        { id: 'profile', icon: '👤', title: 'My Profile', desc: 'View your account information', color: 'var(--accent-soft)', border: 'rgba(232,64,87,0.15)', to: '/profile' },
    ];

    return (
        <div className="page">
            <div style={{ maxWidth: '880px', width: '100%', margin: '0 auto' }}>
                <div className="animate-slam" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="badge" style={{ marginBottom: '0.75rem' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 6px var(--green)' }}></span>
                        Online
                    </div>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', marginBottom: '0.4rem' }}>
                        Welcome, <span className="shimmer-text">{user?.username}</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your account</p>
                </div>

                {/* User Card */}
                <div className="card-static animate-in delay-1" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '44px', height: '44px', background: 'linear-gradient(135deg, var(--accent), #d03050)', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontFamily: "'Bangers', cursive", fontSize: '1.3rem',
                        boxShadow: '0 4px 12px rgba(232,64,87,0.2)',
                    }}>{user?.username?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1px' }}>{user?.username}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{user?.email}</p>
                    </div>
                    <span style={{
                        background: 'rgba(255,200,87,0.08)', border: '1px solid rgba(255,200,87,0.18)',
                        padding: '3px 10px', borderRadius: '6px', fontFamily: "'Bangers', cursive",
                        color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>★ {user?.role || 'Customer'}</span>
                </div>

                {/* Action Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {cards.map((c, i) => (
                        <button key={c.id} id={c.id} onClick={() => navigate(c.to)}
                            className={`card-static animate-in delay-${i + 2}`}
                            style={{
                                padding: '1.5rem', cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif",
                                transition: 'all 0.25s ease', border: `1.5px solid ${c.border}`,
                                background: 'var(--bg-card)', borderRadius: '10px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.2)`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
                                <h3 className="heading-sub" style={{ fontSize: '1.1rem', color: '#fff' }}>{c.title}</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '0.8rem' }}>{c.desc}</p>
                            <span style={{ color: c.color, fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.03em' }}>Open →</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
