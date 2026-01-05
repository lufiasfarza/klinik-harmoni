import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import QuickBooking from "@/components/QuickBooking";
import MobileBookingFlow from "@/components/MobileBookingFlow";
import FloatingBookingButton from "@/components/FloatingBookingButton";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Branches from "@/components/Branches";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicHead from "@/components/DynamicHead";
import { useMobile } from "@/hooks/use-mobile";
import { useClinic } from "@/contexts/ClinicContext";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const isMobile = useMobile();
  const { clinicInfo } = useClinic();

  const handleBookingClick = () => {
    if (isMobile) {
      setShowMobileBooking(true);
    } else {
      setBookingOpen(true);
    }
  };

  const handleMobileBookingComplete = (bookingData: any) => {
    console.log("Mobile booking completed:", bookingData);
    setShowMobileBooking(false);
    // Show success message or redirect
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
      <Testimonials />
      <Footer />
      <WhatsAppButton />
      <FloatingBookingButton onClick={handleBookingClick} />
      
      {/* Desktop Booking */}
      {!isMobile && (
        <QuickBooking open={bookingOpen} onOpenChange={setBookingOpen} />
      )}
      
      {/* Mobile Booking */}
      {isMobile && showMobileBooking && (
        <MobileBookingFlow
          onComplete={handleMobileBookingComplete}
          onClose={() => setShowMobileBooking(false)}
        />
      )}
    </div>
  );
};

export default Index;
