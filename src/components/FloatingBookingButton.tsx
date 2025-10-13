import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMobile } from "@/hooks/use-mobile";

interface FloatingBookingButtonProps {
  onClick: () => void;
}

const FloatingBookingButton = ({ onClick }: FloatingBookingButtonProps) => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`fixed bottom-6 right-6 z-40 shadow-2xl h-14 px-6 rounded-full hover:scale-110 transition-all duration-300 animate-bounce ${
        isMobile ? 'h-16 px-8 text-lg' : ''
      }`}
      aria-label="Book Appointment"
    >
      <Calendar className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'} mr-2`} />
      <span className="font-semibold">
        {isMobile ? 'Book Now' : 'Book Now'}
      </span>
    </Button>
  );
};

export default FloatingBookingButton;
