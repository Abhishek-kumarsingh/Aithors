"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Alert,
  AlertTitle,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Email,
  Lock,
  Person,
  PersonAdd,
  ArrowForward,
  CheckCircle,
  Security,
  AutoAwesome,
  VerifiedUser,
} from "@mui/icons-material";
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const steps = ['Account Details', 'Email Verification', 'Complete Setup'];

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormState({
      ...formState,
      agreeToTerms: checked
    });
  };

  const handleSendOTP = async () => {
    if (!formState.email || !formState.name) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email,
          name: formState.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setCurrentStep(1);

      // Show OTP in toast if available (for testing)
      if (data.debug?.otp) {
        console.log('🔐 OTP Code:', data.debug.otp);
        toast({
          title: "OTP Generated!",
          description: `Your verification code is: ${data.debug.otp} (Check console for details)`,
          duration: 10000, // Show for 10 seconds
        });
      } else {
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setCurrentStep(2);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid OTP code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.agreeToTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to our terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordStrength < 75) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          password: formState.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formState.email,
        password: formState.password,
      });

      if (result?.error) {
        throw new Error('Failed to sign in after registration');
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to AI Interview Platform.",
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);

    try {
      // ✅ CORRECT: Use signIn() in browser with redirect: true
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true // Let NextAuth handle the redirect automatically
      });

      // Note: This code won't execute if redirect: true works
      // The page will redirect to Google OAuth

    } catch (error) {
      console.error('Google registration error:', error);
      toast({
        title: "Error",
        description: "An error occurred during Google sign up",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#ef4444';
    if (passwordStrength < 50) return '#f59e0b';
    if (passwordStrength < 75) return '#eab308';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <PersonAdd sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 1,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 2,
                }}
              >
                Join AI Interview Platform today
              </Typography>

              {/* Progress Stepper */}
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={currentStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.75rem',
                          },
                          '& .MuiStepIcon-root': {
                            color: 'rgba(255, 255, 255, 0.3)',
                            '&.Mui-active': {
                              color: '#a855f7',
                            },
                            '&.Mui-completed': {
                              color: '#10b981',
                            },
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Google Sign Up */}
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleRegister}
                    disabled={isLoading || isGoogleLoading}
                    startIcon={isGoogleLoading ? null : <Google />}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    {isGoogleLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <AutoAwesome />
                      </motion.div>
                    ) : (
                      'Continue with Google'
                    )}
                  </Button>

                  {/* Divider */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        px: 2,
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      Or continue with email
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  </Box>

                  {/* Registration Form - Step 1 */}
                  <Box sx={{ space: 3 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a855f7',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#a855f7',
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a855f7',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#a855f7',
                          },
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSendOTP}
                      disabled={isLoading || !formState.name || !formState.email}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                          boxShadow: '0 12px 35px rgba(168, 85, 247, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <AutoAwesome />
                        </motion.div>
                      ) : (
                        'Send Verification Code'
                      )}
                    </Button>
                  </Box>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <VerifiedUser sx={{ fontSize: 60, color: '#a855f7', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Check Your Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      We've sent a 6-digit verification code to
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#a855f7', fontWeight: 600 }}>
                      {formState.email}
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#a855f7',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#a855f7',
                        },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    endIcon={<CheckCircle />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                      mb: 2,
                    }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <AutoAwesome />
                      </motion.div>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    Resend Code
                  </Button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formState.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a855f7',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#a855f7',
                          },
                        },
                      }}
                    />

                    {/* Password Strength Indicator */}
                    {formState.password && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Password Strength
                          </Typography>
                          <Chip
                            label={getPasswordStrengthText()}
                            size="small"
                            sx={{
                              backgroundColor: getPasswordStrengthColor(),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPasswordStrengthColor(),
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      error={!!(formState.confirmPassword && formState.password !== formState.confirmPassword)}
                      helperText={
                        formState.confirmPassword && formState.password !== formState.confirmPassword
                          ? "Passwords don't match"
                          : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a855f7',
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#ef4444',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#a855f7',
                          },
                          '&.Mui-error': {
                            color: '#ef4444',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#ef4444',
                        },
                      }}
                    />

                    {/* Terms and Conditions */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formState.agreeToTerms}
                          onChange={(e) => handleCheckboxChange(e.target.checked)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#a855f7',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          I agree to the{' '}
                          <Link href="/terms" style={{ color: '#a855f7', textDecoration: 'none' }}>
                            Terms and Conditions
                          </Link>
                        </Typography>
                      }
                      sx={{ mb: 3 }}
                    />

                    {/* Create Account Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading || !formState.agreeToTerms || formState.password !== formState.confirmPassword || passwordStrength < 75}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                          boxShadow: '0 12px 35px rgba(168, 85, 247, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                        mb: 3,
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <AutoAwesome />
                        </motion.div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Already have an account?{' '}
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <Typography
                    component="span"
                    sx={{
                      color: '#a855f7',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        © {new Date().getFullYear()} AI Interview Platform. All rights reserved.
      </Typography>
    </Box>
  );
}
