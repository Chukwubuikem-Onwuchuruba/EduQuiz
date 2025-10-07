// default
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
// import clientPromise from "./db";
// import GoogleProvider from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token }) {
//       // With MongoDBAdapter, NextAuth automatically stores users in "users" collection
//       // You can just set `id` from token.sub (which NextAuth assigns to userId)
//       if (token.sub) {
//         token.id = token.sub;
//       }
//       return token;
//     },
//     session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.picture;
//       }
//       return session;
//     },
//   },
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
// };

// export const getAuthSession = () => getServerSession(authOptions);

// 1st iteration
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
// import clientPromise from "./db";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { Adapter } from "next-auth/adapters";
// import bcrypt from "bcryptjs";
// import connectDB from "./mongoose";
// import User from "../../mongoDB/User";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   adapter: MongoDBAdapter(clientPromise) as Adapter,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });

//         if (!user) {
//           return null;
//         }

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordValid) {
//           return null;
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user, account }) => {
//       if (user) {
//         token.id = user.id;
//       }

//       // For credentials login, fetch user data from database
//       if (account?.provider === "credentials" && token.email) {
//         await connectDB();
//         const db_user = await User.findOne({ email: token.email });
//         if (db_user) {
//           token.id = db_user._id.toString();
//           token.name = db_user.name;
//           token.picture = db_user.image;
//         }
//       }

//       return token;
//     },
//     session: ({ session, token }) => {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.picture;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//     signUp: "/auth/signup",
//   },
// };

// export const getAuthSession = () => {
//   return getServerSession(authOptions);
// };

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import clientPromise from "./db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import connectDB from "./mongoose";
import User from "../../mongoDB/User";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        // Check if user has a password (email/password users)
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
      }

      // For credentials login, fetch user data from database
      if (account?.provider === "credentials" && token.email) {
        await connectDB();
        const db_user = await User.findOne({ email: token.email });
        if (db_user) {
          token.id = db_user._id.toString();
          token.name = db_user.name;
          token.picture = db_user.image;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Only signIn is a valid property
    // Remove signUp: "/auth/signup" - this property doesn't exist
  },
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
