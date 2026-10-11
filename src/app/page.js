import Hero from "./components/Hero";
import PriceRisers from "./components/PriceRisers";
import PriceFallers from "./components/PriceFallers";
import AllProducts from "./components/AllProducts";

export const metadata = {
  title: "বাজার দর - নিত্যপ্রয়োজনীয় দ্রব্যের দৈনিক বাজার মূল্য",
  description: "আজকের চাল, ডাল, তেল, সবজি ও অন্যান্য নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজার দর জানুন।",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <Hero />
      <PriceRisers />
      <PriceFallers />
      <AllProducts />
    </main>
  );
}