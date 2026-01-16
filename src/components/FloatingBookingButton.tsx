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

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 z-40 h-16 px-8 rounded-full shadow-elevated bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:scale-105 transition-all duration-300 animate-float"
      aria-label="Book Appointment"
    >
      <Calendar className="h-6 w-6 mr-2" />
      <span className="font-semibold">{t("nav.bookNow")}</span>
    </Button>
  );
};

export default FloatingBookingButton;
