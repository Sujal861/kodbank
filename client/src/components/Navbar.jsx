import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => { await logout(); navigate('/login'); };
    const active = (p) => location.pathname === p;

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/balance', label: 'Balance' },
        { to: '/transfer', label: 'Transfer' },
        { to: '/history', label: 'History' },
        { to: '/profile', label: 'Profile' },
    ];

    return (
        <nav style={{
            background: 'rgba(19, 20, 31, 0.92)', backdropFilter: 'blur(12px)',
            borderBottom: '1.5px solid rgba(232, 64, 87, 0.12)',
            position: 'sticky', top: 0, zIndex: 50,
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.15)',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
                <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px', height: '32px', background: 'linear-gradient(135deg, #e84057, #d03050)', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontFamily: "'Bangers', cursive", fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(232, 64, 87, 0.3)',
                    }}>K</div>
                    <span className="shimmer-text" style={{ fontFamily: "'Bangers', cursive", fontSize: '1.35rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Kodbank</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }} className="desktop-nav">
                    {isAuthenticated ? (
                        <>
                            {navLinks.map(l => (
                                <Link key={l.to} to={l.to} style={{
                                    fontFamily: "'Outfit', sans-serif", fontWeight: active(l.to) ? '700' : '500',
                                    fontSize: '0.85rem', color: active(l.to) ? '#e84057' : '#b0b0c8', textDecoration: 'none',
                                    padding: '6px 10px', transition: 'color 0.2s',
                                    borderBottom: active(l.to) ? '2px solid #e84057' : '2px solid transparent',
                                }}>{l.label}</Link>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(232,64,87,0.1)' }}>
                                <div style={{
                                    width: '28px', height: '28px', background: 'linear-gradient(135deg, #e84057, #d03050)', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontFamily: "'Bangers', cursive", fontSize: '0.8rem',
                                }}>{user?.username?.charAt(0).toUpperCase()}</div>
                                <button onClick={handleLogout} style={{
                                    fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '0.8rem',
                                    background: 'rgba(232,64,87,0.06)', color: '#ff6b82', border: '1px solid rgba(232,64,87,0.15)',
                                    padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(232,64,87,0.12)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(232,64,87,0.06)'}>Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '500', fontSize: '0.85rem', color: '#b0b0c8', textDecoration: 'none', padding: '6px 12px' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '7px 18px', fontSize: '0.9rem' }}>Register</Link>
                        </>
                    )}
                </div>

                <button className="mobile-btn" onClick={() => setOpen(!open)} style={{
                    display: 'none', background: 'none', border: '1px solid rgba(232,64,87,0.2)', color: '#e84057',
                    fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
                }}>{open ? '✕' : '☰'}</button>
            </div>

            {open && (
                <div className="mobile-menu animate-in" style={{ padding: '0.75rem 1.25rem 1rem', borderTop: '1px solid rgba(232,64,87,0.08)', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(19,20,31,0.98)' }}>
                    {isAuthenticated ? (
                        <>
                            {navLinks.map(l => (
                                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
                                    fontFamily: "'Outfit', sans-serif", fontWeight: '500', fontSize: '0.9rem', color: '#eaeaf5', textDecoration: 'none', padding: '10px 12px',
                                    background: 'rgba(232,64,87,0.03)', borderRadius: '6px',
                                }}>{l.label}</Link>
                            ))}
                            <button onClick={() => { setOpen(false); handleLogout(); }} style={{
                                fontFamily: "'Outfit', sans-serif", fontWeight: '600', background: 'rgba(232,64,87,0.06)', color: '#ff6b82',
                                border: '1px solid rgba(232,64,87,0.15)', padding: '10px', borderRadius: '6px', cursor: 'pointer', marginTop: '4px',
                            }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setOpen(false)} style={{ color: '#eaeaf5', textDecoration: 'none', padding: '10px 12px', fontWeight: '500' }}>Login</Link>
                            <Link to="/register" onClick={() => setOpen(false)} style={{ color: '#eaeaf5', textDecoration: 'none', padding: '10px 12px', fontWeight: '500' }}>Register</Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-btn { display: block !important; } }
        @media (min-width: 769px) { .mobile-menu { display: none !important; } }
      `}</style>
        </nav>
    );
};

export default Navbar;
