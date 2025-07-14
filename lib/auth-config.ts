import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import UserModel from "@/lib/models/User";
import bcrypt from "bcryptjs";

// Demo users for development (fallback only)
const DEMO_USERS = [
  {
    id: "2",
    name: "Demo User",
    email: "demo@example.com",
    password: "demo123",
    role: "user",
    image: null
  }
];

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug for troubleshooting
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          // First, try to find user in database
          const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });

          if (user) {
            // Check if user is blocked
            if (user.isBlocked) {
              throw new Error("Account is blocked. Please contact support.");
            }

            if (await user.comparePassword(credentials.password)) {
              // Update last login
              user.lastLogin = new Date();
              user.isOnline = true;
              user.loginCount = (user.loginCount || 0) + 1;
              await user.save();

              // Determine role - alpsingh03@gmail.com is admin, others are users
              const role = user.email === 'alpsingh03@gmail.com' ? 'admin' : 'user';

              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image,
                role: role
              };
            } else {
              throw new Error("Invalid password");
            }
          }

          // Fallback to demo users only if database user not found
          const demoUser = DEMO_USERS.find(demoUser =>
            demoUser.email === credentials.email &&
            demoUser.password === credentials.password
          );

          if (demoUser) {
            return {
              id: demoUser.id,
              name: demoUser.name,
              email: demoUser.email,
              image: demoUser.image,
              role: demoUser.role
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          // Return null for authentication failure, but log the specific error
          if (error instanceof Error) {
            console.error("Specific auth error:", error.message);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();

          // Check if user exists in database
          let existingUser = await UserModel.findOne({ email: user.email?.toLowerCase() });

          if (!existingUser) {
            // Create new user with appropriate role
            const role = user.email === "alpsingh03@gmail.com" ? "admin" : "user";

            existingUser = new UserModel({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image,
              role: role,
              lastLogin: new Date(),
              isOnline: true,
              loginCount: 1,
              // Generate a random password for OAuth users (they won't use it)
              password: await bcrypt.hash(Math.random().toString(36), 10),
              // Initialize default preferences and profile
              preferences: {
                theme: 'light',
                notifications: true,
                language: 'en'
              },
              profile: {
                techStack: [],
                experienceLevel: 'beginner',
                preferredDomains: [],
                targetRoles: [],
                skills: [],
                goals: {
                  weeklyInterviews: 3,
                  targetScore: 80,
                  focusAreas: []
                }
              },
              performance: {
                totalInterviews: 0,
                completedInterviews: 0,
                averageScore: 0,
                bestScore: 0,
                currentStreak: 0,
                longestStreak: 0,
                weeklyProgress: 0,
                monthlyProgress: 0,
                skillProgress: new Map()
              },
              interviewPreferences: {
                voiceEnabled: false,
                difficulty: 'easy',
                interviewDuration: 30,
                questionTypes: {
                  mcq: true,
                  subjective: true,
                  coding: false,
                  bugFix: false
                }
              }
            });

            await existingUser.save();
          } else {
            // Update last login for existing user and ensure correct role
            existingUser.lastLogin = new Date();
            existingUser.isOnline = true;
            existingUser.loginCount = (existingUser.loginCount || 0) + 1;
            // Ensure alpsingh03@gmail.com always has admin role
            existingUser.role = existingUser.email === "alpsingh03@gmail.com" ? "admin" : "user";
            await existingUser.save();
          }

          // Update user object with database info
          user.id = existingUser._id.toString();
          (user as any).role = existingUser.role;

        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
