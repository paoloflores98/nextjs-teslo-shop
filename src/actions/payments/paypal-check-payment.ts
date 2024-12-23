"use server"
import { PayPalOrderStatusResponse } from "@/interfaces"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken() // Obtener el token Bearer

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener token de verificación",
    }
  }

  const resp = await verifyPayPalPayment(paypalTransactionId, authToken)

  // Verificar si el pago no se completó
  if (!resp) {
    return {
      ok: false,
      message: 'Error al verificar el pago'
    }
  }

  const { status, purchase_units } = resp
  const { invoice_id: orderId } = purchase_units[0] // TODO: invoice ID

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Aún no se ha pagado en PayPal'
    }
  }

  // Realizar la actualización en nuestra base de datos
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })

    // Revalidar un path
    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true
    }

  } catch {
    return {
      ok: false,
      message: '500 - El pago no se pudo realizar'
    }
  }
}

export const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? ""

  
  // Convertir el token a base 64
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64")

  /* Inicio - Generado por Postman */
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
  myHeaders.append("Authorization", `Basic ${base64Token}`)

  const urlencoded = new URLSearchParams()
  urlencoded.append("grant_type", "client_credentials")

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  }
  /* Fin - Generado por Postman */

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: 'no-cache'
    }).then(response => response.json())
    
    return result.access_token
  } catch {
    return null
  }
}

export const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`

  /* Inicio - Generado por Postman */
  const myHeaders = new Headers()
  myHeaders.append(
    "Authorization",
    `Bearer ${bearerToken}`
  )

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  }
  /* Fin - Generado por Postman */

  try {
    const resp = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: 'no-cache'
    }).then(response => response.json())

    return resp
  } catch {
    return null
  }
}