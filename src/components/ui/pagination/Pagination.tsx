"use client"
import { generatePaginationNumbers } from "@/utils"
import Link from "next/link"
import clsx from "clsx"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"

interface Props {
  totalPages: number
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname() // Obtener la ruta actual
  const searchParams = useSearchParams() // Obtener los parámetros URL

  const pageString = searchParams.get("page") ?? 1 // Verificar si el parámetro URL 'page' existe
  const currentPage = isNaN(+pageString) ? 1 : +pageString // Verificar si la página no es un string

  if(currentPage < 1 || isNaN(+pageString)) {
    redirect(pathname)
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages)

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams) // Construir los parámetros URL

    if (pageNumber === "...") return `${pathname}?${params.toString()}`
    
    if (+pageNumber <= 0) return `${pathname}` // Ej: /kid

    if (+pageNumber > totalPages) return `${pathname}?${params.toString()}` // Cuando estás en la última página
    
    params.set("page", pageNumber.toString())
    
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(+currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {allPages.map((page) => (
            <li key={page} className="page-item">
              <Link
                className={clsx(
                  "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                  {"bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700": page === currentPage}
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(+currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}