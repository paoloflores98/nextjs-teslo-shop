"use client"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { authenticate } from "@/actions"
import { IoInformationOutline } from "react-icons/io5"
import clsx from "clsx"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {
  // useFormState: Verificar el comportamiento del inicio de sesión
  const [state, dispatch] = useFormState(authenticate, undefined)

  const searchParams = useSearchParams()
  const params = searchParams.get('origin')

  useEffect(() => {
    if (state === 'Success') {
      if(!!params) return window.location.replace(params)
      window.location.replace('/') // Redireccionar
    }
  }, [state, params])

  return (
    <form className="flex flex-col" action={dispatch}>
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        id="email"
        name="email"
        type="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        id="password"
        name="password"
        type="password"
      />

      {/* Verificar si las credenciales no son correctas */}
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === "CredentialsSignin" && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">
              Las credenciales no son correctas
            </p>
          </div>
        )}
      </div>

      <LoginButton />
      {/* <button
        className="btn-primary"
        type="submit"
      >Ingresar</button> */}

      {/* Divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending
      })}
      type="submit"
      disabled={pending}
    >
      Ingresar
    </button>
  )
}