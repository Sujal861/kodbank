import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(''); };

    const submit = async (e) => {
        e.preventDefault(); setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/login', { email: form.email, password: form.password });
            login(res.data.user);
            toast.success('Welcome back! ⚡');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Server offline. Start the backend.' : 'Login failed.');
            setError(msg); toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            <div className="card animate-slam" style={{ maxWidth: '420px', width: '100%', padding: '2.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div className="animate-float animate-glow" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⛩️</div>
                    <h1 className="heading-manga" style={{ fontSize: '1.9rem', marginBottom: '0.35rem' }}>
                        Welcome <span className="shimmer-text">Back</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Sign in to your account</p>
                </div>
                {error && <div className="error-box">⚠️ {error}</div>}
                <form onSubmit={submit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label" htmlFor="login-email">Email</label>
                        <input id="login-email" className="input" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={set} required autoComplete="email" />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label" htmlFor="login-password">Password</label>
                        <input id="login-password" className="input" type="password" name="password" placeholder="Enter password" value={form.password} onChange={set} required autoComplete="current-password" />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}></span>Signing in...</> : '⚡ Sign In'}
                    </button>
                </form>
                <hr className="divider" />
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    New here? <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: '700' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
