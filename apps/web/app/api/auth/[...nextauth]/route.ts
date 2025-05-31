import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client"; // Correct import for Prisma

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: { params: { prompt: "consent", access_type: "offline" } },
    }),
  ],
  session : {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) return false;

      await prisma.user.upsert({
        where: { email: profile.email },
        update: {
          googleId: profile.sub,
          refreshToken: account?.refresh_token,
          accessToken: account?.access_token,
          expiresAt: account?.expires_at,
        },
        create: {
          email: profile.email,
          googleId: profile.sub,
          refreshToken: account?.refresh_token,
          accessToken: account?.access_token,
          expiresAt: account?.expires_at,
        },
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const userDB = await prisma.user.findUnique({
          where: { email: user.email ||''},
        });

        if (userDB) {
          token.id = userDB.id; // 👈 Add user ID
          token.email = userDB.email;
          token.accessToken = userDB.accessToken;
          token.refreshToken = userDB.refreshToken;
          token.expiresAt = userDB.expiresAt;
        }
      }

      if (Date.now() > (Number(token.expiresAt) ?? 0) * 1000) {
        const refreshed = await refreshAccessToken(token);
        return { ...token, ...refreshed };
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user = {
        ...session.user, 
        accessToken: token.accessToken, 
        refreshToken: token.refreshToken, 
        expiresAt: token.expiresAt, 
      };
    
      return session;
    }    
  },
};
    
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: token.refreshToken!,
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    await prisma.user.update({
      where: { email: token.email },
      data: {
        accessToken: refreshedTokens.access_token,
        expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      },
    });

    return {
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
    };
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return { ...token, error: "RefreshTokenError" };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
