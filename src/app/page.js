import Image from "next/image";
import Navbar from "./components/home/Navbar";
import HeroSection from "./components/home/HeroSection";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <>
    <div className="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-50 selection:text-white min-h-screen flex flex-col justify-between min-w-100">
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <Features></Features>
      <Footer></Footer>
    </div>
    
    </>
  );
}
