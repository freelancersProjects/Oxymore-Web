import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaDiscord, FaGoogle, FaSteam, FaFacebook } from 'react-icons/fa';
import apiService from '../../api/apiService';
import { OXMButton } from '@oxymore/ui';
import './Register.scss';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const [passwordVisible, setPasswordVisible] = useState(false);
  const images = ["/brand_login.png"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
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
        await apiService.post('/auth/register', formData);
        navigate('/login');
      } catch (error) {
        setErrors(prev => ({ ...prev, form: 'Registration failed. Please try again.' }));
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
              <h1>Create an Account</h1>
              <p>Join Oxymore and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Your first name (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Your last name (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
                placeholder="Create a password"
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

              <OXMButton
                type="submit"
                variant="primary"
                size="large"
                className="auth-button"
              >
                Create Account
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
              <button className="social-button facebook">
                <FaFacebook />
                <span>Facebook</span>
              </button>
            </div>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
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
                    src={images[0]}
                    alt="Gaming Experience"
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

export default Register;
