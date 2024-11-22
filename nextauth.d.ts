import NextAuth, { DefaultSession } from "next-auth"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       name: string
//       email: string
//       emailVerified?: boolean
//       role: string
//       image?: string
//     } & DefaultSession['user']
//   }
// }

declare module "next-auth" {
  interface Session {
    user: User // La sesión utiliza el tipo User
  }
  interface JWT {
    data?: User // El JWT también utiliza User
  }
}