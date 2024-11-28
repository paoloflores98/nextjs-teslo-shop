"use server"
import prisma from "@/lib/prisma"

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId }
    })

    // Verificar si no existe la dirección
    if (!address) return null

    const { countryId, address2, ...rest } = address

    return {
      ...rest,
      country: countryId,
      address2: address2 ? address2 : '',
    }

  } catch (error) {
    console.log('getUserAddress', error)
    
    return null
  }
}