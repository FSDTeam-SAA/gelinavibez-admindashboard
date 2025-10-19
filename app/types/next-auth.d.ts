import NextAuth, { DefaultSession } from "next-auth";
console.log(NextAuth)

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      userId?: string;
      email?: string | null;
      name?: string | null;
      role?: string | null;
    };

    accessToken?: string;
    refreshToken?: string;
    message?: string;
    success?: boolean;
    statusCode?: number;
    role?: string;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    email?: string;
    message?: string;
    success?: boolean;
    statusCode?: number;
    role?: string;
    
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    email?: string;
    message?: string;
    success?: boolean;
    statusCode?: number;
    role?: string;
  }
}
