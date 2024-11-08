import { Size } from "@/interfaces"
import clsx from "clsx"

interface Props {
  selectedSize: Size
  availableSizes: Size[] // ['XS', 'M', 'XXL']
}

export const SizeSelector = ({selectedSize, availableSizes}: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>

      <div className="flex">
        {availableSizes.map(size => (
          <button
            className={clsx(
              "mx-2 hover:underline text-lg",
              {'underline': size === selectedSize} // Subrayar la talla seleccionada
            )}
            key={size}
          >{size}</button>
        ))}
      </div>
    </div>
  )
}