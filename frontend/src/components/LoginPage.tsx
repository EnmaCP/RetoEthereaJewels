import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './UserContext'; 
import { authAPI } from '../services/apiService';
import './LoginPage.css';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const { setCustomer } = useUser(); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authAPI.login(identifier, password);
            setCustomer(data.customer);
            const role = data.customer?.role;
            if (role === 'admin' || role === 'employee') {
                navigate('/intranet');
            } else {
                navigate('/profile');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome back!</h2>
            
            {error && (
                <div className="login-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
                <div>
                    <label htmlFor="identifier" className="login-label">Email or username</label>
                    <input 
                        type="text" 
                        id="identifier" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={isLoading}
                        className="login-input" 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="login-label">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="login-input" 
                    />
                </div>
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Log in'}
                </button>
            </form>

            <div className="login-footer">
                Don't have an account? <Link to="/register" className="login-link">Register here</Link>
            </div>
        </div>
    );
}