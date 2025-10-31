import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    email: string;
    role: string;
    userId: string;
    user: {
      role: string;
    };
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data: LoginResponse = await res.json();

        if (!res.ok || !data?.data?.accessToken) return null;

        if (data.data.user.role !== "admin") {
          throw new Error("admin_only");
        }

        return {
          id: data.data.userId,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          email: data.data.email,
          role: data.data.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        email: token.email,
        role: token.role,
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
