import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClinic } from "@/contexts/ClinicContext";

const WhatsAppButton = () => {
  const { clinicInfo } = useClinic();
  const phoneNumber = (clinicInfo?.contact?.whatsapp || "60123456789").replace(/\D/g, "");
  const message = "Hello! I would like to inquire about your services.";
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!phoneNumber) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-6 left-6 z-50 rounded-full h-16 w-16 shadow-elevated hover:scale-110 transition-transform bg-[#25D366] hover:bg-[#20BA59] text-white"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
    </Button>
  );
};

export default WhatsAppButton;
