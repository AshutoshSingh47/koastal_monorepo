import Team from "@/public/team.svg";
import Image from "next/image";

export function AboutUs() {
  return (
    <section className="flex flex-col-reverse lg:flex-row justify-center items-center gap-10 sm:gap-20 lg:items-start w-full mx-auto my-8 py-20 px-4">
      <div className="w-full sm:w-lg h-full">
        <h1 className="text-2xl md:text-3xl font-semibold text-center sm:text-end">About Us</h1>
        <article className="text-start sm:text-end mt-4 leading-relaxed">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo
          aspernatur nulla officia illum! Magnam rerum velit ea quisquam labore,
          illum nulla provident sequi accusantium, minus quibusdam doloremque
          ducimus pariatur corporis. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Pariatur, sunt sed magni officia esse sequi
          asperiores laborum nesciunt ullam corrupti repellat commodi at
          impedit, sapiente, repudiandae mollitia voluptate molestiae odio.
        </article>
      </div>

      <Image src={Team} alt="about-us" className="w-lg h-lg" />
    </section>
  );
}
