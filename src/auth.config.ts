import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z.object({
          email: z.string().email(),
          password: z.string().min(4)
        }).safeParse(credentials)

        // Verificar si el esquema no es correcto
        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        console.log('authConfig.ts', {email, password});

        // Buscar el correo

        // Comparar las contraseñas

        // Retornar el usuario

        return null
      },
    }),
  ]
}

export const { signIn, signOut, auth } = NextAuth(authConfig)