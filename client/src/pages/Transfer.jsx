import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Transfer = () => {
    const [form, setForm] = useState({ recipient: '', amount: '', note: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(''); };

    const submit = async (e) => {
        e.preventDefault(); setError(''); setSuccess(null);
        if (!form.recipient || !form.amount) { setError('Recipient and amount are required.'); return; }
        if (Number(form.amount) < 1) { setError('Minimum amount is ₹1.'); return; }
        setLoading(true);
        try {
            const res = await axios.post('/api/transfer', { recipient: form.recipient, amount: Number(form.amount), note: form.note }, { withCredentials: true });
            setSuccess(res.data);
            toast.success(res.data.message || 'Transfer successful!');
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#e84057', '#ffc857', '#5ce0d8', '#a78bfa'], zIndex: 9999 });
            setForm({ recipient: '', amount: '', note: '' });
        } catch (err) {
            if (err.response?.status === 401) { toast.error('Session expired'); navigate('/login'); return; }
            const msg = err.response?.data?.message || 'Transfer failed.';
            setError(msg); toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            <div style={{ maxWidth: '480px', width: '100%' }}>
                <div className="animate-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.3rem' }}>
                        Send <span className="shimmer-text">Money</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Transfer funds to another Kodbank user</p>
                </div>

                {success ? (
                    <div className="card animate-slam" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
                        <h2 className="heading-sub" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--green)' }}>Transfer Complete!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                            <strong style={{ color: 'var(--gold)', fontFamily: "'Bangers', cursive", fontSize: '1.6rem' }}>
                                ₹{success.data.amount.toLocaleString('en-IN')}
                            </strong>
                            <br />sent to <strong>{success.data.receiver}</strong>
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                            New balance: ₹{success.data.newBalance.toLocaleString('en-IN')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button className="btn-primary" onClick={() => setSuccess(null)} style={{ padding: '10px 20px', fontSize: '0.95rem' }}>Send More</button>
                            <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', fontSize: '0.95rem' }}>Dashboard</button>
                        </div>
                    </div>
                ) : (
                    <div className="card animate-slam" style={{ padding: '2rem' }}>
                        <div className="animate-float" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
                        {error && <div className="error-box">⚠️ {error}</div>}
                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Recipient (email or username)</label>
                                <input className="input" name="recipient" placeholder="user@email.com or username" value={form.recipient} onChange={set} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Amount (₹)</label>
                                <input className="input" name="amount" type="number" placeholder="Enter amount" value={form.amount} onChange={set} min="1" max="1000000" required style={{ fontSize: '1.1rem', fontWeight: '700' }} />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label">Note <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: "'Outfit',sans-serif" }}>(optional)</span></label>
                                <input className="input" name="note" placeholder="What's this for?" value={form.note} onChange={set} maxLength={200} />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                                {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}></span>Sending...</> : '⚡ Send Money'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="animate-in delay-3" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>← Back</button>
                </div>
            </div>
        </div>
    );
};

export default Transfer;
