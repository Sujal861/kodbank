const Loader = () => {
    return (
        <div className="loader-container">
            <div style={{ textAlign: 'center' }}>
                <div className="loader-spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p
                    style={{
                        color: '#9ca3af',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default Loader;
