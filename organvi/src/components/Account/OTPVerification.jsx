import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Edit3, Check, X, ArrowLeft } from 'lucide-react';
import './OTPVerification.css';

const OTPVerification = ({ phoneNumber, countryCode, onVerifyOTP, onResendOTP, onEditNumber, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showResendMessage, setShowResendMessage] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Show success message for 2 seconds when component mounts
    setShowSuccess(true);
    const successTimer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    return () => clearTimeout(successTimer);
  }, []);

  useEffect(() => {
    if (resendTimer > 0 && !isVerified) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && !isVerified) {
      setCanResend(true);
      setShowResendMessage(true);
    }
  }, [resendTimer, isVerified]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsVerified(true);
      setShowVerificationSuccess(true);
      
      // Show success message for 2 seconds, then navigate
      setTimeout(() => {
        onVerifyOTP(otpString);
      }, 2000);
    }
  };

  const handleResendOTP = () => {
    if (resendCount < 3) {
      setResendCount(resendCount + 1);
      setResendTimer(30);
      setCanResend(false);
      setShowResendMessage(false);
      setOtp(['', '', '', '', '', '']);
      setShowSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      
      onResendOTP();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal-container">
        <div className="otp-form">
          {/* Close Button */}
          <button className="modal-close-btn" onClick={onBack}>
            ×
          </button>
        {/* Back Button */}
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="otp-header">
          <h1 className="otp-title">Enter OTP</h1>
          <p className="otp-subtitle">The OTP is sent on Mobile number</p>
        </div>

        {/* Mobile Number Display */}
        <div className="mobile-display">
          <span className="mobile-number">{countryCode} {phoneNumber}</span>
          <button className="edit-btn" onClick={onEditNumber}>
            <Edit3 size={16} />
          </button>
        </div>

        {/* OTP Input Fields */}
        <form onSubmit={handleVerifyOTP} className="otp-form-container">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                required
              />
            ))}
          </div>

          {/* Verify OTP Button */}
          <button type="submit" className="verify-otp-btn">
            <span>Verify OTP</span>
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-message">
            <Check size={20} />
            <span>OTP sent successfully!</span>
            <button className="close-btn" onClick={() => setShowSuccess(false)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Verification Success Message */}
        {showVerificationSuccess && (
          <div className="verification-success-message">
            <Check size={20} />
            <span>OTP verified successfully!</span>
          </div>
        )}

        {/* Resend OTP Section */}
        <div className="resend-section">
          {showResendMessage ? (
            <>
              <p className="resend-text">Didn't Receive the OTP?</p>
              {resendCount < 3 ? (
                <button className="resend-btn" onClick={handleResendOTP}>
                  Resend OTP ({3 - resendCount} attempts left)
                </button>
              ) : (
                <p className="resend-limit-text">Maximum resend attempts reached</p>
              )}
            </>
          ) : !isVerified ? (
            <>
              <p className="resend-text">Didn't Receive the OTP?</p>
              <p className="timer-text">{formatTime(resendTimer)}</p>
            </>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
