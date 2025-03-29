import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for stateless sessions
  },
  callbacks: {
    async session({ session, token }:any) {
      session.user.id = token.sub; // Attach user ID to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
