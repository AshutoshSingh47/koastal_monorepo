import { SERVICES } from "@/data/services";
import { ContentContainer } from "./content-container";

export function Services() {
  return (
    <section className="w-full my-8 py-20 bg-accent bg-[url(/noise-light.png)] ">
      <ContentContainer>
        <h1 className="text-2xl md:text-3xl font-semibold">Why Customers Trust Koastal</h1>
        <p className="mt-1 mx-1.5">Our promise of quality and reliability</p>
        <ul className="my-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-rows-subgrid gap-8 justify-center">
          {SERVICES.map((service) => (
            <li
              key={service.name}
              className="flex flex-col items-center gap-4 text-center py-12 px-4 border rounded-md bg-white"
            >
              <span>
                <service.logo
                  className="h-16 w-16 aspect-square text-[#3139fb]"
                  strokeWidth={1}
                />
              </span>

              <h2 className="block font-semibold text-base mb-0.5">
                {service.name}
              </h2>
              <p className="text-sm text-zinc-800 leading-relaxed">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </ContentContainer>
    </section>
  );
}
