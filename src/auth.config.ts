import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "./lib/prisma"
import { User as PrismaUser } from "@prisma/client"

// Rutas protegidas
// const authenticatedRoutes = [
//   "/auth/login",
//   "/auth/new-account"
// ]

// const checkoutAddressRoute = [
//   "/checkout/address",
// ]

export const authConfig: NextAuthConfig = {
  trustHost: true,  // Asegura que NextAuth confíe en el host durante el build
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    authorized() {
      // const isLoggedIn = !!auth?.user
      // const authRoutes = authenticatedRoutes.some(item => nextUrl.pathname.includes(item))
      // const checkoutRoutes = checkoutAddressRoute.some(item => nextUrl.pathname.includes(item))

      // if (authRoutes && isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl))
      // }

      // if (checkoutRoutes) {
      //   if (isLoggedIn) return true

      //   return Response.redirect(new URL(`/auth/login?origin=${nextUrl.pathname}`, nextUrl))
      // }

      return true
    },

    jwt({ token, user }) {
      if (user) {
        // token.data = user
        token.data = user as PrismaUser // Asegura el tipo correcto
      }

      return token
    },

    session({ session, token }) {
      // session.user = token.data as any
      session.user = token.data as PrismaUser

      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const credentialsSchema = z.object({
          email: z.string().email(),
          password: z.string().min(4)
        })

        const validateCredentials = credentialsSchema.safeParse(credentials)

        // Verificar si el esquema no es correcto
        if (!validateCredentials.success) throw new Error('Datos no válidos introducidos')
        const { email, password } = validateCredentials.data

        // Buscar el correo
        const user = await prisma.user.findUnique({ where: { email } }) // Esto debió estar en la carpeta actions
        if (!user) throw new Error('Correo no encontrado') // Verificar si no existe el correo

        // Comparar las contraseñas
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Contraseña incorrecta') // Validar la contraseña ingresada con la contraseña en la DB

        // Retornar los campos del usuario excepto la contraseña
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user

        return rest
      },
    }),
  ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)