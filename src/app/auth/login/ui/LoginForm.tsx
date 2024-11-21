"use client"
import Link from "next/link"
import { useFormState } from "react-dom"
import { authenticate } from "@/actions"

export const LoginForm = () => {
  // useFormState: Verificar el comportamiento del inicio de sesión
  const [state, dispatch] = useFormState(authenticate, undefined)
  console.log('En consola',{state})

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

      <button
        className="btn-primary"
        type="submit"
      >Ingresar</button>

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