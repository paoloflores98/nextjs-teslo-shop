import { Footer, Sidebar, TopMenu } from "@/components"

export default function ShopLayout({children}: {children: React.ReactNode}) {
  return (
    <main className="min-h-screen">
      <TopMenu /> {/* Renderiza el componente */}

      <Sidebar /> {/* Renderiza el componente */}

      <div className="px-0 sm:px-10">
        {children}
      </div>

      <Footer /> {/* Renderiza el componente */}
    </main>
  )
}