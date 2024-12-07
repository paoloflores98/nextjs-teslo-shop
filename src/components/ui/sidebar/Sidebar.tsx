"use client"
import Link from "next/link"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { useUIStore } from "@/store"
import { logout } from "@/actions"

// Instalar la dependencia clsx: npm install clsx

export const Sidebar = () => {
  const { isSideMenuOpen, closeSideMenu } = useUIStore()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const isAdmin = session?.user.role === "admin"
  
  const onLogout = async () => {
    await logout()
    window.location.replace('/')
    closeSideMenu()
  }
  
  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          onClick={closeSideMenu} // Cerrar el menú por fuera del Sidebar
        />
      )}

      {/* Sidemenu */}
      <nav
        className={
          clsx(
            "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
            {
              // isSideMenuOpen inicia con false en Zustand
              // !false: Trasladar todo a la derecha
              "translate-x-full": !isSideMenuOpen
            }
          )
        }
      >
        <IoCloseOutline
          className="absolute top-5 right-5 cursor-pointer"
          size={50}
          onClick={closeSideMenu} // Cerrar el menú en el botón 'X'
        />

        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline
            className="absolute top-2 left-2"
            size={20}
          />
          <input
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Buscar"
          />
        </div>

        {/* Menú */}
        {/* Si el usuario SÍ está autenticado */}
        {isAuthenticated && (
          <>
            <Link
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              href="/profile"
              onClick={closeSideMenu}
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>

            <Link
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              href="/orders"
              onClick={closeSideMenu}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Órdenes</span>

            </Link>
            <button
              className="flex w-full items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => onLogout()}// Cerrar sesión desde el server action
            >
              <IoLogOutOutline size={30} />
              <span className="ml-3 text-xl">Salir</span>
            </button>
          </>
        )}

        {/* Si el usuario NO está autenticado */}
        {!isAuthenticated && (
          <Link
            className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            href="/auth/login"
            onClick={() => closeSideMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              href="/admin/products"
              onClick={closeSideMenu}
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              href="/admin/orders"
              onClick={closeSideMenu}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Órdenes</span>
            </Link>

            <Link
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              href="/admin/users"
              onClick={closeSideMenu}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}