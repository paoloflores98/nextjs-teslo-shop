"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import clsx from "clsx"
import type { Address, Country } from "@/interfaces"
import { useAddressStore } from "@/store"
import { deleteUserAddress, setUserAddress } from "@/actions"

type FormInputs = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  postalCode: string
  city: string
  country: string
  phone: string
  rememberAddress: boolean
}

interface Props {
  countries: Country[]
  userStoredAddress?: Partial<Address> // Todas las propiedades de Address son opcionales
}

export const AddressForm = ({ countries, userStoredAddress }: Props) => {
  const router = useRouter()

  const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
    defaultValues: {
      // ...(userStoredAddress as any),
      ...(userStoredAddress),
      rememberAddress: false, // Casilla deseleccionada
    }
  })

  // Si la sesión del usuario está activa
  const { data: session } = useSession({
    required: true,
  })

  const { address, setAddress } = useAddressStore() // Zustand

  useEffect(() => {
    // Verificar si se tiene una dirección registrada
    if (address.firstName) {
      reset(address) // Reiniciar el formulario
    }
  }, [address, reset])

  const onSubmit = async (data: FormInputs) => { // Ejecutar función después de validar los campos al enviar
    const { rememberAddress, ...restAddress } = data
    setAddress(restAddress) // Actualizar la dirección de entrega

    if (rememberAddress) {
      await setUserAddress(restAddress, session!.user.id)
    } else {
      await deleteUserAddress(session!.user.id)
    }

    router.push('/checkout') // Redireccionar
  }

  return (
    <form
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col mb-2">
        <label htmlFor="firstName">Nombres</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="firstName"
          {...register('firstName', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="lastName">Apellidos</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="lastName"
          {...register('lastName', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="address">Dirección</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="address"
          autoComplete="false"
          {...register('address', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="address2">Dirección 2 (opcional)</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="address2"
          {...register('address2')}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="postalCode">Código postal</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="postalCode"
          {...register('postalCode', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="city">Ciudad</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="city"
          {...register('city', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="country">País</label>
        <select
          className="p-2 border rounded-md bg-gray-200"
          id="country"
          autoComplete="false"
          {...register('country', { required: true })}
        >
          <option value="">-- Seleccionar --</option>
          {countries.map(country => (
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="phone">Teléfono</label>
        <input
          className="p-2 border rounded-md bg-gray-200"
          type="text"
          id="phone"
          autoComplete="false"
          {...register('phone', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        <div className="inline-flex items-center mb-10">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="rememberAddress"
            data-ripple-dark="true"
          >
            <input
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              type="checkbox"
              id="rememberAddress"
              {...register('rememberAddress')}
            // checked
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>

          <span>¿Recordar dirección?</span>
        </div>

        <button
          className={clsx({
            'btn-primary': isValid,
            'btn-disabled': !isValid,
          })}
          type="submit"
          disabled={!isValid}
        >Siguiente</button>
      </div>
    </form>
  )
}