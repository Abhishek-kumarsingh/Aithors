"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
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
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Email,
  Lock,
  Person,
  Security,
  Login,
  ArrowForward,
  Star,
  AutoAwesome,
} from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import { TwoFactorForm } from "@/components/auth/two-factor-form";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Check if user is already logged in and redirect to appropriate dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User is already authenticated, redirecting to appropriate dashboard");
      console.log("Session user role:", session?.user?.role);

      // Redirect to the appropriate dashboard based on role
      if (session?.user?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  // Check for admin credentials (hidden detection)
  useEffect(() => {
    if (email === "alpsingh03@gmail.com") {
      setIsAdminLogin(true);
    } else {
      setIsAdminLogin(false);
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", {
        email,
        password: "***",
      });

      // Use NextAuth credentials provider for all users
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        // Check if this is a 2FA required error
        try {
          const errorData = JSON.parse(result.error);
          if (errorData.error === "2FA_REQUIRED") {
            // Set 2FA required state
            setTwoFactorRequired(true);
            setTwoFactorEmail(email);
            setTwoFactorToken(errorData.validationToken);
            setIsLoading(false);
            return; // Exit early, don't show error toast
          }
        } catch (e) {
          // Not a JSON error, continue with normal error handling
        }

        throw new Error(result.error);
      }

      // Get user role from session to determine redirect
      const updatedSession = await fetch('/api/auth/check-session');
      const sessionData = await updatedSession.json();
      const userRole = sessionData?.user?.role;

      if (userRole === "admin") {
        toast({
          title: "Admin Login Successful!",
          description: "Redirecting to admin dashboard...",
          className: "bg-blue-500 text-white",
        });
        router.push("/dashboard/admin");
      } else {
        toast({
          title: "Login Successful!",
          description: "Redirecting to your dashboard...",
          className: "bg-green-500 text-white",
        });
        router.push("/dashboard");
      }
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard", // Middleware will redirect: admin -> /dashboard/admin, users -> /dashboard/home
      });
    } catch (error: any) {
      // Catches errors if signIn itself throws before redirecting
      console.error("Google login initiation error:", error);
      toast({
        title: "Google Sign-In Error",
        description:
          error.message || "Could not start Google sign-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false); // This might not be hit if redirect: true succeeds.
    }
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
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {twoFactorRequired ? (
            <CardContent sx={{ p: 4 }}>
              <TwoFactorForm
                email={twoFactorEmail}
                validationToken={twoFactorToken}
                onSuccess={() => {
                  // Get user role from session to determine redirect
                  fetch('/api/auth/check-session')
                    .then(res => res.json())
                    .then(data => {
                      if (data?.user?.role === "admin") {
                        toast({
                          title: "Admin Login Successful!",
                          description: "Two-factor authentication verified.",
                          className: "bg-blue-500 text-white",
                        });
                        router.push("/admin");
                      } else {
                        router.push("/dashboard");
                      }
                      router.refresh();
                    });
                }}
                onCancel={() => {
                  setTwoFactorRequired(false);
                  setTwoFactorEmail("");
                  setTwoFactorToken("");
                }}
              />
            </CardContent>
          ) : (
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
                    <Login sx={{ fontSize: 40 }} />
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
                  Welcome Back!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 2,
                  }}
                >
                  Sign in to access your dashboard
                </Typography>

                {/* Admin indicator */}
                <AnimatePresence>
                  {isAdminLogin && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Chip
                        icon={<Security />}
                        label="Admin Access"
                        sx={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* Google Sign In */}
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
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

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ space: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                  autoComplete="email"
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

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                  autoComplete="current-password"
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

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#a855f7',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || isGoogleLoading}
                  endIcon={isLoading ? null : <ArrowForward />}
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
                    'Sign In'
                  )}
                </Button>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" style={{ textDecoration: 'none' }}>
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
                        Sign up now
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          )}
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
