import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import QuickBooking from "@/components/QuickBooking";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Branches from "@/components/Branches";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <QuickBooking />
      <Services />
      <Doctors />
      <Branches />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
