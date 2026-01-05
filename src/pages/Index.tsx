import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingBookingButton from "@/components/FloatingBookingButton";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Branches from "@/components/Branches";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicHead from "@/components/DynamicHead";
import { useClinic } from "@/contexts/ClinicContext";
import Booking from "@/components/Booking";

const Index = () => {
  const { clinicInfo } = useClinic();

  const handleBookingClick = () => {
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <DynamicHead
        description={clinicInfo?.tagline || "Perkhidmatan kesihatan profesional dengan cawangan di seluruh Malaysia"}
      />
      <Navbar />
      <HeroCarousel />
      <Stats />
      <Services />
      <Doctors />
      <Branches />
      <Booking />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
      <FloatingBookingButton onClick={handleBookingClick} />
    </div>
  );
};

export default Index;
