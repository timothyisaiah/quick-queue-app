import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { API_BASE_URL } from '@/lib/utils/api';

export const authConfig = {
  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt", // ✅ required for JWT-based login
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProvider = auth?.user?.role === 'provider';
      const isClient = auth?.user?.role === 'client';
    
      const isProviderDashboard = nextUrl.pathname.startsWith('/provider');
      const isClientDashboard = nextUrl.pathname.startsWith('/client');
    
      if (isProviderDashboard && !isProvider) return false;
      if (isClientDashboard && !isClient) return false;
    
      if (isLoggedIn && nextUrl.pathname === '/login') {
        // Redirect logged-in users away from login page
        const redirectPath = isProvider ? '/provider/dashboard' : '/client/book';
        return Response.redirect(new URL(redirectPath, nextUrl));
      }
    
      // Block access to protected routes if not logged in
      if (!isLoggedIn && (isProviderDashboard || isClientDashboard)) {
        return false;
      }
    
      return true;
    },

    async jwt({ token, user }) {
      // 👇 Only runs at login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (res.ok && data.user && data.access_token) {
          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.access_token,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
