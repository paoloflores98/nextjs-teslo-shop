"use client"
import { generatePaginationNumbers } from "@/utils"
import Link from "next/link"
import clsx from "clsx"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6"

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
    
    // if(+pageNumber <= 0) return `${pathname}` // Ej: /kid
    // if(+pageNumber > totalPages) return `${pathname}?${params.toString()}` // Ej: Cuando estás en la última página
    
    if(isNaN(+pageNumber) || +pageNumber < 1 || +pageNumber > totalPages) return `${pathname}?${params.toString()}` // Línea nueva
    
    params.set("page", pageNumber.toString())
    
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none items-center">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(1)}
            >
              <FaAnglesLeft size={20} />
            </Link>
          </li>

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(+currentPage - 1)}
            >
              <FaAngleLeft size={20} />
            </Link>
          </li>

          {allPages.map((page, index) => (
            <li key={`${page}${index}`} className="page-item">
              <Link
                className={clsx(
                  "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 focus:shadow-none",
                  {"bg-blue-600 hover:bg-blue-700 text-white hover:text-white shadow-sm": page === currentPage},
                  {"hover:bg-gray-200": page !== currentPage}
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(+currentPage + 1)}
            >
              <FaAngleRight size={20} />
            </Link>
          </li>

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(totalPages)}
            >
              <FaAnglesRight size={20} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}