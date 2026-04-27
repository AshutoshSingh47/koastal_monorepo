import { AboutUs } from "@/components/ui/about-us";
import { Byline } from "@/components/ui/byline";
import { Carousel } from "@/components/ui/carousel";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import { Products } from "@/components/ui/products";
import { Services } from "@/components/ui/services";
import { Testimonials } from "@/components/ui/testimonials";

export default function Home() {
  return (
    <>
      <Byline />
      <Navbar />
      <Carousel />
      <section className="">
        <AboutUs />
        <Services />
        <Products />
        <Testimonials />
      </section>
      <Footer />
    </>
  );
}
