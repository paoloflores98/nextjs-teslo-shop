"use client"
import { useState } from 'react'
import { Swiper as SwiperObject } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import './slideshow.css'; // Estilos propios del curso
import { ProductImage } from '../product-image/ProductImage'

interface Props {
  images: string[]
  title: string
  className?: string
}

export const ProductSlideshow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>()

  return (
    <div className={className}>
      {/* Desktop */}
      <Swiper
        style={
          {
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
          } as React.CSSProperties // Solo para que no marquen en rojo los estilos
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{ delay: 2500 }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {images.map(image => (
          <SwiperSlide key={image}>
            <ProductImage
              className="rounded-lg object-fill"
              src={image}
              width={1024}
              height={800}
              alt={title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Mobile */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map(image => (
          <SwiperSlide key={image}>
            <ProductImage
              className="rounded-lg object-fill"
              src={image}
              width={300}
              height={300}
              alt={title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}