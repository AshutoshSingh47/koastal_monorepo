import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { ContentContainer } from "./content-container";

export function Products() {
  return (
    <section className="products my-8 py-20">
      <ContentContainer>
        <h1 className="text-center text-2xl md:text-3xl font-semibold">
          Explore different categories
        </h1>
        <ul className="my-10 w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-2 cursor-pointer"
            >
              <div className="group relative w-full overflow-hidden rounded-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={480}
                  height={480}
                  className="w-full aspect-square object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {product.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </ContentContainer>
    </section>
  );
}
