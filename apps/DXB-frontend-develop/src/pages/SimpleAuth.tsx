import React, { useState } from 'react';

const SimpleAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isOtp, setIsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSendOtp = () => {
    if (email) {
      setIsOtp(true);
      alert(`OTP sent to ${email}! Use code: 123456`);
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456') {
      alert('Login successful!');
      window.location.href = '/';
    } else {
      alert('Invalid OTP code. Try: 123456');
    }
  };

  const handleGoogleAuth = () => {
    alert('Google Auth Demo - Login successful!');
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            🔐 Dubai MVP
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Sign in to access the platform
          </p>
        </div>

        {!isOtp ? (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={!email}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: email ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: email ? 'pointer' : 'not-allowed',
                marginBottom: '1rem'
              }}
            >
              Send OTP Code
            </button>

            <div style={{
              textAlign: 'center',
              margin: '1.5rem 0',
              position: 'relative'
            }}>
              <hr style={{ border: '1px solid #e5e7eb' }} />
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                padding: '0 1rem',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                OR
              </span>
            </div>

            <button
              onClick={handleGoogleAuth}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>🔗</span>
              Continue with Google
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Enter OTP Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={!otpCode}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: otpCode ? '#059669' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: otpCode ? 'pointer' : 'not-allowed',
                marginBottom: '1rem'
              }}
            >
              Verify & Sign In
            </button>

            <button
              onClick={() => setIsOtp(false)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back to Email
            </button>
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Demo Mode:</strong>
          <br />• Any email works
          <br />• OTP Code: 123456
          <br />• Google Auth: Instant login
        </div>
      </div>
    </div>
  );
};

export default SimpleAuth;
