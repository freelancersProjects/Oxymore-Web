import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaDiscord, FaGoogle, FaSteam } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../api/apiService';
import { OXMCheckbox, OXMButton } from '@oxymore/ui';
import './Login.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  const images = [
    "https://images.unsplash.com/flagged/photo-1560177776-295b9cd779de?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsImageTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsImageTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors] || errors.form) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
        form: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await apiService.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        login({ user: response.user, token: response.token });
        navigate('/');
      } catch (error) {
        setErrors({ form: 'Invalid credentials or server error.' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-background">
            <div className="auth-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <img src="/oxymore.svg" alt="Oxymore" />
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to your Oxymore account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {errors.form && <span className="error-message form-error">{errors.form}</span>}

              <div className="form-options">
                <OXMCheckbox
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  name="rememberMe"
                  label="Remember me"
                  theme="purple"
                  size="large"
                />
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
              </div>

              <OXMButton
                type="submit"
                variant="primary"
                size="large"
                className="auth-button"
              >
                Sign In
              </OXMButton>
            </form>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-button discord">
                <FaDiscord />
                <span>Discord</span>
              </button>
              <button className="social-button google">
                <FaGoogle />
                <span>Google</span>
              </button>
              <button className="social-button steam">
                <FaSteam />
                <span>Steam</span>
              </button>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-visual">
            <div className="visual-content">
              <div className="visual-title">
              </div>
              <div className="visual-image">
                <div className="image-container">
                  <img
                    src={images[currentImageIndex]}
                    alt="Gaming Experience"
                    key={currentImageIndex}
                    className={isImageTransitioning ? 'transitioning' : ''}
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
            <div className="visual-bg">
              <div className="bg-gradient"></div>
              <div className="bg-pattern"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
