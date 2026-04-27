"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import QuoteIcon from "@/public/quote.svg";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import { ContentContainer } from "./content-container";

export function Testimonials() {
  return (
    <section className="mt-8 w-full bg-accent bg-[url(/noise-light.png)] py-20">
      <ContentContainer>
        <h1 className="text-2xl md:text-3xl font-semibold text-end">
          What Our Customers Say
        </h1>
        <Swiper
          loop={true}
          spaceBetween={30}
          slidesPerView={2}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
          }}
          className="testimonial-swiper absolute inset-0 h-full w-full my-10"
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1, // 👈 mobile (0px+)
            },
            768: {
              slidesPerView: 2, // 👈 tablet & desktop (>=768px)
            },
          }}
        >
          <SwiperSlide className="h-full w-full">
            <div className="px-10 py-8 relative bg-white border rounded-md">
              <Image
                src={QuoteIcon}
                className="absolute w-5 h-5 left-2.5"
                alt="quote"
              />
              <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias mollitia aspernatur est ipsum unde, id commodi tempore
                a ex ut quas, vel laboriosam esse rerum cumque iste possimus.
                Mollitia, eligendi.
              </h2>
              <div className="block mt-10">
                <p className="block font-bold">John Smith</p>
                <span className="block mt-1 text-sm">Delhi</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-full w-full bg-accent">
            <div className="px-10 py-8 relative bg-white border rounded-md">
              <Image
                src={QuoteIcon}
                className="absolute w-5 h-5 left-2.5"
                alt="quote"
              />
              <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias mollitia aspernatur est ipsum unde, id commodi tempore
                a ex ut quas, vel laboriosam esse rerum cumque iste possimus.
                Mollitia, eligendi.
              </h2>
              <div className="block mt-10">
                <p className="block font-bold">John Doe</p>
                <span className="block mt-1 text-sm">Gorakhpur</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-full w-full bg-accent">
            <div className="px-10 py-8 relative bg-white border rounded-md">
              <Image
                src={QuoteIcon}
                className="absolute w-5 h-5 left-2.5"
                alt="quote"
              />
              <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias mollitia aspernatur est ipsum unde, id commodi tempore
                a ex ut quas, vel laboriosam esse rerum cumque iste possimus.
                Mollitia, eligendi.
              </h2>
              <div className="block mt-10">
                <p className="block font-bold">John Smith</p>
                <span className="block mt-1 text-sm">Delhi</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-full w-full bg-accent">
            <div className="px-10 py-8 relative bg-white border rounded-md">
              <Image
                src={QuoteIcon}
                className="absolute w-5 h-5 left-2.5"
                alt="quote"
              />
              <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias mollitia aspernatur est ipsum unde, id commodi tempore
                a ex ut quas, vel laboriosam esse rerum cumque iste possimus.
                Mollitia, eligendi.
              </h2>
              <div className="block mt-10">
                <p className="block font-bold">John Doe</p>
                <span className="block mt-1 text-sm">Gorakhpur</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </ContentContainer>
    </section>
  );
}
