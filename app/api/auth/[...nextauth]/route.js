import User from "@models/User";
import { connectToDB } from "@mongodb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password.");
        }

        const isMatchPassword = await compare(
          credentials.password,
          user.password
        );

        if (!isMatchPassword) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongoDbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongoDbUser._id.toString();

      const { password, ...userWithoutPassword } = mongoDbUser._doc;
      session.user = { ...session.user, ...userWithoutPassword }; // mongoDbUser._doc means the complete info about loggedIn User...

      return session;
    },
  },
});

export { handler as GET, handler as POST };
