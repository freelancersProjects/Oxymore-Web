import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OXMButton } from '@oxymore/ui';
import './ForgotPassword.scss';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    form?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email || errors.form) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // TODO: Implémenter l'envoi d'email de réinitialisation
        console.log('Envoi d\'email de réinitialisation à:', email);
        setIsSubmitted(true);
      } catch (error) {
        setErrors({ form: 'Failed to send reset email. Please try again.' });
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
                <h1>Check Your Email</h1>
                <p>We've sent a password reset link to {email}</p>
              </div>

              <div className="success-message">
                <p>If you don't see the email, check your spam folder or try again.</p>
              </div>

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
              <h1>Forgot Password?</h1>
              <p>Enter your email address and we'll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {errors.form && <span className="error-message form-error">{errors.form}</span>}

              <OXMButton
                type="submit"
                variant="primary"
                size="large"
                className="auth-button"
              >
                Send Reset Link
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

export default ForgotPassword;
