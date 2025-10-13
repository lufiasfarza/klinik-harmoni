import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import QuickBooking from "@/components/QuickBooking";
import FloatingBookingButton from "@/components/FloatingBookingButton";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Branches from "@/components/Branches";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <Stats />
      <Services />
      <Doctors />
      <Branches />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
      <FloatingBookingButton onClick={() => setBookingOpen(true)} />
      <QuickBooking open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default Index;
