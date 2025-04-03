import { useState } from 'react';
import '../../assets/style/account.css';
import { FaUser, FaEnvelope, FaLock, FaEye, FaGoogle } from 'react-icons/fa';
import image_read from '../../assets/Images/reading.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../API/axios';
import { FaTimes } from 'react-icons/fa'; // Import the icon
const Signup = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleCancel = () => {
        navigate('/');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
    
        // Check required fields
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword, // Corrected here
            });
            console.log('User registered:', response.data);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                console.error('An error occurred during registration:', error);
            }
        }
    };

    return (
        <div className="container_account">
            <div className="form-container">
                <div className="signup-box">
                    <h2 style={{"color":"black"}}>SIGNUP</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <FaUser />
                            <input
                                className="input_acc"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errors.name && <div className="error_pass"><p className="error">{errors.name}</p></div>}
                        
                        <div className="input-box">
                            <FaEnvelope />
                            <input
                                className="input_acc"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errors.email && <div className="error_pass"><p className="error">{errors.email}</p></div>}
                        
                        <div className="input-box">
                            <FaLock />
                            <input
                                className="input_acc"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <div className="check_eye" onClick={() => setShowPassword(!showPassword)}>
                                <FaEye />
                            </div>
                        </div>
                        {errors.password && <div className="error_pass"><p>{errors.password}</p></div>}
                        
                        <div className="input-box">
                            <FaLock />
                            <input
                                className="input_acc"
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            <div className="check_eye" onClick={() => setShowPassword(!showPassword)}>
                                <FaEye />
                            </div>
                        </div>   
                        {errors.confirmPassword && <div className="error_pass"><p>{errors.confirmPassword}</p></div>} 
                        
                        <button type="submit" className="btn">Sign Up Now</button>
                        <p>
                            Have an account? <Link to="/login">Login</Link>
                        </p>
                        <button type="button" className="cancel-btn" onClick={handleCancel} >
                            <FaTimes style={{ marginRight: '8px' }} />
                        </button>
                        <div className="with_google">
                            <button className="google-btn">
                                <FaGoogle /> Sign Up with Google
                            </button>
                        </div>
                    </form>
                </div>
                <div className="promo-box">
                    <div className="controll_image_form">
                        <div className="image_form">
                            <img src={image_read} alt="logo" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;