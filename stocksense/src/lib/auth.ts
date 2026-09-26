import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        loginId: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.loginId || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { loginId: credentials.loginId }
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role, loginId: user.loginId };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.loginId = (user as any).loginId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).loginId = token.loginId;
      }
      return session;
    }
  }
};
