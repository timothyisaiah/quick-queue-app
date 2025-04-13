import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';

console.log('✅ [...nextauth] API route loaded');

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Authorize function called with:', credentials);

        try {
          const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            console.error('❌ Login failed:', data);
            return null;
          }

          console.log('✅ Login successful:', data.user);

          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error('❌ Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('💾 JWT callback - storing user:', user);
        token.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('📦 Session callback - returning session');
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// const handler = await NextAuth(authOptions);

// export { handler as GET, handler as POST };

const { handlers } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;