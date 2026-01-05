import Booking from "@/components/Booking";
import { X } from "lucide-react";

interface MobileBookingFlowProps {
  onComplete: (bookingData: unknown) => void;
  onClose: () => void;
}

const MobileBookingFlow = ({ onClose }: MobileBookingFlowProps) => (
  <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </button>
    <div className="pt-10">
      <Booking />
    </div>
  </div>
);

export default MobileBookingFlow;
