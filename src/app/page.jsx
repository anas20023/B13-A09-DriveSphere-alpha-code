import HeroSection from "@/components/HeroSection";
const getCars = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/cars`)
    if (!res.ok) {
      throw new Error('Failed to fetch cars');
    }
    return res.json()
  } catch (error) {
    console.log(error.message)
    return []
  }
}
export default async function Home() {
  const res = await getCars()
  const cars = res.slice(1)
  // console.log(cars)
  return (
    <>
      <HeroSection cars={cars} />
      <section className="min-h-screen max-w-6xl mx-auto">
      </section>
    </>
  );
}
