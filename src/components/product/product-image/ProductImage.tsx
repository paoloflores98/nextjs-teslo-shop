import Image from "next/image"

interface Props {
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className']
  src?: string
  width: number
  height: number
  alt: string
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style']
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const ProductImage = ({ src, alt, className, style, width, height }: Props) => {
  const localSrc = (src)
    ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg' // Imagen por defecto

  return (
    <Image
      className={className}
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      style={style}
    />
  )
}