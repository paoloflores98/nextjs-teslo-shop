import { create } from "zustand"
import { persist } from "zustand/middleware"

interface State {
  address: {
    firstName: string
    lastName: string
    address: string
    address2?: string
    postalCode: string
    city: string
    country: string
    phone: string
  }
  setAddress: (address: State["address"]) => void // Su tipo es el address de la interface State
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },

      setAddress: (address) => { // Actualizar la dirección
        set({ address })
      },
    }),
    {
      name: "address-storage",
    }
  )
)