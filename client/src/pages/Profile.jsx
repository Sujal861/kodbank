import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/api/profile');
                setData(res.data.data);
            } catch (err) {
                if (err.response?.status === 401) { navigate('/login'); return; }
                toast.error('Failed to load profile');
            } finally { setLoading(false); }
        };
        load();
    }, []);

    const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (loading) return <div className="loader"><span className="spinner"></span></div>;

    return (
        <div className="page">
            <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto' }}>
                <div className="animate-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.3rem' }}>
                        My <span className="shimmer-text">Profile</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your account information</p>
                </div>

                <div className="card animate-slam" style={{ padding: '2rem' }}>
                    {/* Avatar */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div className="animate-float" style={{
                            width: '70px', height: '70px', background: 'linear-gradient(135deg, var(--accent), #d03050)', borderRadius: '16px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontFamily: "'Bangers', cursive", fontSize: '2rem',
                            boxShadow: '0 6px 20px rgba(232,64,87,0.25)', marginBottom: '0.75rem',
                        }}>
                            {data?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="heading-sub" style={{ fontSize: '1.4rem', marginBottom: '0.15rem' }}>{data?.username}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{data?.email}</p>
                    </div>

                    <hr className="divider" />

                    {/* Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <InfoItem label="Balance" value={fmt(data?.balance)} highlight />
                        <InfoItem label="Role" value={data?.role} gold />
                        <InfoItem label="Phone" value={data?.phone} />
                        <InfoItem label="Transactions" value={data?.totalTransactions} />
                        <InfoItem label="Hero ID" value={data?.uid?.substring(0, 12) + '...'} />
                        <InfoItem label="Member Since" value={fmtDate(data?.memberSince)} />
                    </div>
                </div>

                <div className="animate-in delay-3" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>← Dashboard</button>
                    <button className="btn-primary" onClick={() => navigate('/transfer')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Send Money →</button>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value, highlight, gold }) => (
    <div>
        <p className="fx-label" style={{ marginBottom: '3px' }}>{label}</p>
        <p style={{
            fontSize: highlight ? '1.15rem' : '0.92rem',
            fontWeight: highlight || gold ? '700' : '500',
            color: highlight ? 'var(--green)' : gold ? 'var(--gold)' : 'var(--text-primary)',
            fontFamily: highlight ? "'Bangers', cursive" : "'Outfit', sans-serif",
            letterSpacing: highlight ? '0.03em' : '0',
        }}>{value}</p>
    </div>
);

export default Profile;
