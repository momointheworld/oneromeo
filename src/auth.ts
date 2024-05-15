// import NextAuth from 'next-auth';
// import Github from 'next-auth/providers/github';
// import { PrismaAdapter } from '@auth/prisma-adapter'; 
// import { db } from '@/db';

// const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
// const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

// if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
//      throw new Error ('Missing github oauth credentials.')
// }

// export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
//     adapter: PrismaAdapter(db),
//     providers: [
//         Github({
//             clientId: GITHUB_CLIENT_ID,
//             clientSecret: GITHUB_CLIENT_SECRET
//         })
//     ],
//     callbacks: {
//         // usually not needed, here we are fixing a bug in nextauth
//     //     async session({session, user}: any) {
//     //      if (session && user) {
//     //         session.user.id = user.id
//     //      }
//     //      return session;
//     //     }
//     // }
//     async signIn({ user, account, profile, email, credentials }) {
//         const isAllowedToSignIn = true
//         if (isAllowedToSignIn) {
//           return true
//         } else {
//           // Return false to display a default error message
//           return false
//         }
//       },

//       async session({session, user}: any) {
//              if (session && user) {
//                 session.user.id = user.id
//              }
//              return session;
//             }
//         }
// })

import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter'; 
import { db } from '@/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
     throw new Error ('Missing github oauth credentials.')
}

// Define the allowed user here
const allowedUser = 'email@oneromeo.com'; // Change this to the username or email you want to allow

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Github({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // Verify if the user is allowed access
            if (profile?.email === allowedUser || profile?.login === allowedUser) {
                return true; // Allow access
            } else {
                return false; // Deny access
            }
        },
        async session({ session, user }: any) {
            if (session && user) {
                session.user.id = user.id;
            }
            return session;
        }
    }
});
