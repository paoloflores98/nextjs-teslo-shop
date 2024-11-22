"use server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
      },

      // Seleccionar algunos campos a retornar
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return {
      ok: true,
      user: user,
      message: 'Usuario creado'
    }

  } catch (error) {
    console.log(error)

    return {
      ok: false,
      message: 'No se pudo crear el usuario'
    }
  }
}