import '../../assets/style/account.css';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import image_read from '../../assets/Images/reading.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios_api from '../../API/axios';
import { FaTimes } from 'react-icons/fa'; // Import the icon
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios_api.post('login', { email, password });
            const { token, role, user, role_message } = response.data;
            console.log(token);
            localStorage.setItem('authToken', token);
            localStorage.setItem('Role', role);
            localStorage.setItem('userID', user.id);
            axios_api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (role_message) {
                alert(role_message);
            }

            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google login functionality
        alert("Google login functionality not implemented yet.");
    };

    const handleCancel = () => {
        // Reset email and password fields
        setEmail("");
        setPassword("");

        // Optionally navigate to another page, e.g., home
        navigate('/');
    };

    return (
        <div className="container_account">
            <div className="form-container">
                <div className="login-box">
                    <h2>LOGIN</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form className="form" onSubmit={handleLogin}>
                        <div className="input-box">
                            <FaUser />
                            <input
                                className="input_acc"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Username or email"
                                required
                                aria-label="Username or email"
                            />
                        </div>
                        <div className="input-box">
                            <FaLock />
                            <input
                                className="input_acc"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                aria-label="Password"
                            />
                            <div className="check_eye" onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login Now'}
                        </button>

                        <button type="button" className="cancel-btn" onClick={handleCancel} disabled={loading}>
                            <FaTimes style={{ marginRight: '8px' }} />
                        </button>

                        <p>
                            Do not have an account?
                            <Link to="/signup"> Signup</Link>
                        </p>

                        <div className="with_google">
                            <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                                <FaGoogle /> Login with Google
                            </button>
                        </div>
                    </form>
                </div>
                <div className="promo-box">
                    <div className="controll_image_form">
                        <div className="image_form">
                            <img src={image_read} alt="reading" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
