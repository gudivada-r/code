import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const payload = isRegistering
            ? { email, password_hash: password, full_name: "TEST User" } // Simplification
            : new URLSearchParams({ username: email, password: password });

        try {
            const config = isRegistering ? {} : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            const response = await api.post(endpoint, payload, config);

            if (!isRegistering) {
                localStorage.setItem('token', response.data.access_token);
                navigate('/dashboard');
            } else {
                alert("Registration successful! Please login.");
                setIsRegistering(false);
            }
        } catch (error) {
            alert("Authentication failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="auth-container" style={{ background: 'radial-gradient(circle at center, #1e293b, #0f172a)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '4rem',
                    width: '100%',
                    maxWidth: '480px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 4px 20px rgba(83, 91, 242, 0.4)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Student Success
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        Your personal AI academic navigator.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'white' }}>
                        {isRegistering ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                            University Email
                        </label>
                        <input
                            type="email"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                        {isRegistering ? 'Get Started' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
                        onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? (
                            <span>Already have an account? <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in</span></span>
                        ) : (
                            <span>Don't have an account? <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</span></span>
                        )}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
