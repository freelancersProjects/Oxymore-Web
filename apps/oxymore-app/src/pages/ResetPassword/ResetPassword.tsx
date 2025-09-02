import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { OXMButton } from '@oxymore/ui';
import './ResetPassword.scss';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ form: 'Invalid or missing reset token' });
      return;
    }

    if (validateForm()) {
      try {
        // TODO: Implémenter la réinitialisation du mot de passe
        console.log('Réinitialisation du mot de passe avec le token:', token);
        setIsSubmitted(true);
      } catch (error) {
        setErrors({ form: 'Failed to reset password. Please try again.' });
      }
    }
  };

  if (isSubmitted) {
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
                <h1>Password Updated!</h1>
                <p>Your password has been successfully reset</p>
              </div>

              <div className="success-message">
                <p>You can now sign in with your new password.</p>
              </div>

              <div className="auth-footer">
                <p>Ready to sign in? <Link to="/login" className="auth-link">Sign in</Link></p>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-visual">
              <div className="visual-content">
                <div className="visual-image">
                  <div className="image-container">
                    <img
                      src="/brand_login.png"
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
  }

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
              <h1>Reset Password</h1>
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your new password"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {errors.form && <span className="error-message form-error">{errors.form}</span>}

              <OXMButton
                type="submit"
                variant="primary"
                size="large"
                className="auth-button"
              >
                Reset Password
              </OXMButton>
            </form>

            <div className="auth-footer">
              <p>Remember your password? <Link to="/login" className="auth-link">Sign in</Link></p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-visual">
            <div className="visual-content">
              <div className="visual-image">
                <div className="image-container">
                  <img
                    src="/brand_login.png"
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

export default ResetPassword;
