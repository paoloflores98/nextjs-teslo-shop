"use client"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions"

interface Props {
  orderId: string
  amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer() // Skeleton
  const rountedAmount = (Math.round(amount * 100)) / 100 // Convertir a 2 decimales

  if (isPending) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-2" />
      </div>
    )
  }

  // Crear la orden
  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${rountedAmount}`,
            currency_code: 'USD'
          }
        }
      ]
    })

    const { ok } = await setTransactionId(orderId, transactionId)

    // Verificar que no se actualizó la orden
    if (!ok) throw new Error('No se pudo actualizar la orden')

    return transactionId
  }

  // Aprobar la orden
  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture()

    if (!details) return

    // await paypalCheckPayment(details.id)
    await paypalCheckPayment(details.id ?? '')
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
    />
  )
}