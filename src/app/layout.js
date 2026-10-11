
import "./globals.css";
import Navbar from "./components/Navbar";
import PriceTicker from "./components/PriceTicker";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

export const metadata = {
  title: "BazarDor",
  description: "আজকের বাজার দর",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Toaster position="top-right" />

        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <PriceTicker />

        {children}
        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}



