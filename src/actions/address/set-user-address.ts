"use server"
import type { Address } from "@/interfaces"
import prisma from "@/lib/prisma"

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId)

    return {
      ok: true,
      address: newAddress,
    }

  } catch (error) {
    console.log('set-user-address.ts', error)

    return {
      ok: false,
      message: "No se pudo guardar la dirección",
    }
  }
}

export const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    })

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    }

    // Verificar si no se tiene una dirección guardada
    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      })

      return newAddress
    }

    // Actualizar la dirección
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })

    return updatedAddress

  } catch (error) {
    console.log('set-user-address.ts', error)
    throw new Error('createOrReplaceAddress: No se pudo guardar la dirección')
  }
}