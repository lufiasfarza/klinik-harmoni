import { Button } from "@/components/ui/button";

interface BookingConfirmationProps {
  bookingReference?: string;
  onClose: () => void;
}

const BookingConfirmation = ({ bookingReference, onClose }: BookingConfirmationProps) => (
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Booking Confirmation</h2>
    {bookingReference ? (
      <p className="text-muted-foreground">Reference: {bookingReference}</p>
    ) : (
      <p className="text-muted-foreground">Your booking is being processed.</p>
    )}
    <Button onClick={onClose}>Close</Button>
  </div>
);

export default BookingConfirmation;
