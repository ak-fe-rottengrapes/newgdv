import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const authOption = {
  session: {
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        token.is_admin = user.is_admin;
        token.is_employee = user.is_employee;
        token.user_id = user.id; 
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.access = token.access;
      session.user.refresh = token.refresh;
      session.user.role = token.role;
      session.user.is_admin = token.is_admin;
      session.user.is_employee = token.is_employee;
      session.user.user_id = token.user_id;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            `${api_url}/login`,
            {
              email: credentials.username,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = response.data;

          if (user) {
            if (!user.profile_complete || !user.is_active) {
              const errorMessage = `Account Issue: ${user.error || "Please complete your profile."}`;

            }

            return {
              ...user,
              is_admin: user.account.is_admin,
              is_employee: user.account.is_employee,
              id: user.account.id, 
            };
          } else {
            throw new Error("Invalid credentials or response data.");
          }
        } catch (error) {
            console.error("API Error Response:", error.response);
            throw new Error(JSON.stringify(error.response?.data) || "Authentication failed.")
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",  
    signOut: "/auth/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };