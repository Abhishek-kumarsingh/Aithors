import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ResponsiveThemeProvider } from '@/components/shared/responsive-theme-provider';
// Material UI handles notifications through its own system
import { NextAuthProvider } from '@/contexts/session-provider';
import { AOSProvider } from '@/components/shared/aos-provider';
import { ImpersonationWrapper } from '@/components/shared/impersonation-wrapper';
import { TaskInitializer } from '@/components/shared/task-initializer';
import { MUIThemeProvider } from '@/components/shared/mui-theme-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InterviewAI - AI-Powered Interview Platform',
  description: 'Schedule and conduct AI-powered interviews with real-time feedback and analysis',
  authors: [{ name: 'InterviewAI Team' }],
  keywords: ['interview', 'AI', 'hiring', 'recruitment', 'job interview'],
};

// Viewport configuration is now handled via meta tags in the head
// since Viewport type is not available in Next.js 13.5.1

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f0f0f" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <ResponsiveThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MUIThemeProvider>
              <AOSProvider>
                <ImpersonationWrapper>
                  {children}
                </ImpersonationWrapper>
                <TaskInitializer />
              </AOSProvider>

            </MUIThemeProvider>
          </ResponsiveThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
