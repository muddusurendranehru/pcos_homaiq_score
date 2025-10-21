import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authAPI } from '../services/api';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',  // Field name: phone (aligned)
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional, but if provided must be valid)
    if (formData.phone) {
      const phoneRegex = /^(\+\d{1,3})?\d{10}$/;
      const cleanPhone = formData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Phone must be +countrycode + 10 digits (e.g., +919876543210) or just 10 digits (9876543210)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Call signup API with phone parameter (aligned)
      const response = await authAPI.signup(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.fullName,
        formData.phone  // Field name: phone (aligned)
      );

      if (response.success) {
        // Store token and user info
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_email', response.user.email);
        
        setSuccessMessage('Account created successfully! Redirecting...');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path || err.param || 'general'] = err.msg;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Activity size={40} color="#667eea" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              PCOS HOMA-IQ
            </h1>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Create Account
          </h2>
          <p style={{ color: '#6b7280' }}>
            Sign up to start tracking your PCOS assessments
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            padding: '12px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {successMessage}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errors.general}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Email - FIRST for importance */}
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              autoFocus
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          {/* Phone Number - name: phone (aligned) */}
          <div className="form-group">
            <label htmlFor="phone" className="label">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+919876543210 or 9876543210"
              disabled={isLoading}
            />
            {errors.phone && <div className="error">{errors.phone}</div>}
            <small style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
              Format: +91xxxxxxxxxx or 10 digits (9876543210)
            </small>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="label">
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="label">
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              disabled={isLoading}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: '#667eea', 
              fontWeight: '600', 
              textDecoration: 'none' 
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
