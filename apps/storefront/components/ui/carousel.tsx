"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import { ContentContainer } from "./content-container";

export function Carousel() {
  return (
    <section className="carousel w-full">
      <ContentContainer className="relative">
        <div className="hidden sm:block">
          <button
            type="button"
            className="group absolute top-1/2 left-3 sm:left-6 md:left-10 z-10 -translate-y-1/2 cursor-pointer flex items-center justify-center bg-black/40 text-white w-9 h-9 md:w-10 md:h-10 rounded-full swiper-button-prev-custom"
          >
            <MoveLeft className="w-4 h-4 transition-transform transform-gpu group-hover:-translate-x-0.5 duration-300 ease-in-out" />
          </button>
          <button
            type="button"
            className="group absolute top-1/2 right-3 sm:right-6 md:right-10 z-10 -translate-y-1/2 cursor-pointer flex items-center justify-center bg-black/40 text-white w-9 h-9 md:w-10 md:h-10 rounded-full swiper-button-next-custom"
          >
            <MoveRight className="w-4 h-4 transition-transform transform-gpu group-hover:translate-x-0.5 duration-300 ease-in-out" />
          </button>
        </div>

        <div className="relative w-full overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/10]">
          <Swiper
            loop={true}
            spaceBetween={30}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            effect={"fade"}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            className="carousel-swiper absolute inset-0 h-full w-full"
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
          >
            <SwiperSlide className="h-full w-full">
              <div className="relative h-full w-full">
                <Image
                  fill
                  priority
                  className="h-full w-full object-cover"
                  sizes="100vw"
                  src="https://demos.codezeel.com/wordpress/WCM09/WCM090211/default/wp-content/uploads/2025/02/main-banner-1.jpg"
                  alt="Bathroom faucet set"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="h-full w-full">
              <div className="relative h-full w-full">
                <Image
                  fill
                  priority
                  className="h-full w-full object-cover"
                  sizes="100vw"
                  src="https://demos.codezeel.com/wordpress/WCM09/WCM090211/default/wp-content/uploads/2025/02/main-banner-2.jpg"
                  alt="Stylish kitchen sink setup"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </ContentContainer>
    </section>
  );
}
