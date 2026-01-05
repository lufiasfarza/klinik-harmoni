import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";
import Booking from "@/components/Booking";

interface QuickBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickBooking = ({ open, onOpenChange }: QuickBookingProps) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent className="max-h-[90vh] overflow-y-auto">
      <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DrawerClose>
      <Booking />
    </DrawerContent>
  </Drawer>
);

export default QuickBooking;
