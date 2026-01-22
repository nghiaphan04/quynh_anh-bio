/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        // Simple check: if password matches env var, return admin user
        if (credentials?.password === adminPassword) {
          return { id: "1", name: "Admin", email: "admin@example.com", role: "admin" };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', // Show login modal on home page instead of redirect
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
