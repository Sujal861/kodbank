import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const History = () => {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const navigate = useNavigate();

    const fetch = async (p = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/transactions?page=${p}&limit=15`, { withCredentials: true });
            setTxns(res.data.data.transactions);
            setPagination(res.data.data.pagination);
            setPage(p);
        } catch (err) {
            if (err.response?.status === 401) { navigate('/login'); return; }
            toast.error('Failed to load transactions');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const fmtTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="page">
            <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto' }}>
                <div className="animate-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 className="heading-manga" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.3rem' }}>
                        Transaction <span className="shimmer-text">History</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All your recent transactions</p>
                </div>

                <div className="card-static animate-in delay-1" style={{ overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <span className="spinner" style={{ width: '32px', height: '32px' }}></span>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.9rem' }}>Loading...</p>
                        </div>
                    ) : txns.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.6 }}>📭</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>No transactions yet</p>
                            <button className="btn-primary" onClick={() => navigate('/transfer')} style={{ padding: '10px 22px', fontSize: '0.95rem' }}>
                                Send Your First Transfer →
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div style={{ display: 'flex', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                <span style={{ flex: 2 }}>Details</span>
                                <span style={{ flex: 1, textAlign: 'right' }}>Amount</span>
                            </div>
                            {txns.map((tx, i) => (
                                <div key={tx.id} className={`tx-row animate-in delay-${Math.min(i + 1, 5)}`}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0,
                                        background: tx.type === 'sent' ? 'rgba(232,64,87,0.08)' : 'rgba(52,211,153,0.08)',
                                    }}>
                                        {tx.type === 'sent' ? '↑' : '↓'}
                                    </div>
                                    <div style={{ flex: 2, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1px' }}>
                                            {tx.type === 'sent' ? `To ${tx.counterparty}` : `From ${tx.counterparty}`}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            {fmtDate(tx.date)} · {fmtTime(tx.date)}
                                            {tx.note && <span> · {tx.note}</span>}
                                        </p>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <p style={{
                                            fontSize: '0.95rem', fontWeight: '700',
                                            color: tx.type === 'sent' ? 'var(--accent)' : 'var(--green)',
                                        }}>
                                            {tx.type === 'sent' ? '−' : '+'}{fmt(tx.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                    <button className="btn-secondary" disabled={page <= 1} onClick={() => fetch(page - 1)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>← Prev</button>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>{page}/{pagination.pages}</span>
                                    <button className="btn-secondary" disabled={page >= pagination.pages} onClick={() => fetch(page + 1)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Next →</button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="animate-in delay-3" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>← Back</button>
                </div>
            </div>
        </div>
    );
};

export default History;
