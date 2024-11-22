import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcrypt"
import prisma from "./lib/prisma"


export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
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
        // if (!validateCredentials.success) return null
        if (!validateCredentials.success) throw new Error('Datos no válidos introducidos')

        const { email, password } = validateCredentials.data

        console.log('authConfig.ts', { email, password });

        // Buscar el correo
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new Error('Correo no encontrado') // Verificar si no existe el correo

        // Comparar las contraseñas
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Contraseña incorrecta') // Validar la contraseña ingresada con la contraseña en la DB

        // Retornar los campos del usuario excepto la contraseña
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user
        console.log('auth.config.ts', rest)

        return rest
      },
    }),
  ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)