import AvailableCars from "@/components/AvailableCars";
import HeroSection from "@/components/HeroSection";
import { getCars } from "@/utils/utils";

export default async function Home() {
  const cars = await getCars()
  // const cars = res.slice(0,6)
  return (
    <>
      <HeroSection cars={cars} />
      <section className="min-h-screen max-w-6xl mx-auto">
        <AvailableCars />
      </section>
    </>
  );
}
