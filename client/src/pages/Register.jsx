import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(''); };

    const submit = async (e) => {
        e.preventDefault(); setError('');
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const res = await axios.post('/api/register', { username: form.username, email: form.email, password: form.password, phone: form.phone });
            toast.success(res.data.message || 'Account created!');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Server offline. Start the backend first.' : 'Registration failed.');
            setError(msg); toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            <div className="card animate-slam" style={{ maxWidth: '440px', width: '100%', padding: '2.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div className="animate-float animate-glow" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚔️</div>
                    <h1 className="heading-manga" style={{ fontSize: '1.9rem', marginBottom: '0.35rem' }}>
                        Join the <span className="shimmer-text">Guild</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Create your Kodbank account</p>
                </div>
                {error && <div className="error-box">⚠️ {error}</div>}
                <form onSubmit={submit}>
                    <Field label="Username" id="register-username" name="username" placeholder="Choose a username" value={form.username} onChange={set} required minLength={3} autoComplete="username" />
                    <Field label="Email" id="register-email" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={set} required autoComplete="email" />
                    <Field label="Phone" id="register-phone" type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={set} autoComplete="tel" optional />
                    <Field label="Password" id="register-password" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={set} required minLength={6} autoComplete="new-password" />
                    <Field label="Confirm Password" id="register-confirm-password" type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={set} required autoComplete="new-password" />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                        {loading ? <Spin /> : '⚡ Create Account'}
                    </button>
                </form>
                <hr className="divider" />
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '700' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

const Field = ({ label, optional, ...props }) => (
    <div style={{ marginBottom: '0.9rem' }}>
        <label className="label" htmlFor={props.id}>{label}{optional && <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: "'Outfit',sans-serif" }}> (optional)</span>}</label>
        <input className="input" {...props} />
    </div>
);

const Spin = () => (<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>Creating...</span>);

export default Register;
