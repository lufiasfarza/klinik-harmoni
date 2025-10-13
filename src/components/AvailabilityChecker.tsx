import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  doctor?: string;
}

interface AvailabilityCheckerProps {
  branchId: string;
  serviceId: string;
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const AvailabilityChecker = ({ 
  branchId, 
  serviceId, 
  selectedDate, 
  onTimeSelect, 
  selectedTime 
}: AvailabilityCheckerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);

  // Mock data - replace with actual API call
  const mockTimeSlots: TimeSlot[] = [
    { time: "09:00", available: true, doctor: "Dr. Sarah" },
    { time: "09:30", available: false },
    { time: "10:00", available: true, doctor: "Dr. Ahmad" },
    { time: "10:30", available: true, doctor: "Dr. Sarah" },
    { time: "11:00", available: false },
    { time: "11:30", available: true, doctor: "Dr. Ahmad" },
    { time: "14:00", available: true, doctor: "Dr. Sarah" },
    { time: "14:30", available: false },
    { time: "15:00", available: true, doctor: "Dr. Ahmad" },
    { time: "15:30", available: true, doctor: "Dr. Sarah" },
    { time: "16:00", available: false },
    { time: "16:30", available: true, doctor: "Dr. Ahmad" },
    { time: "17:00", available: true, doctor: "Dr. Sarah" },
  ];

  useEffect(() => {
    fetchAvailability();
  }, [branchId, serviceId, selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTimeSlots(mockTimeSlots);
    
    // Find next available date if current date is fully booked
    const hasAvailableSlots = mockTimeSlots.some(slot => slot.available);
    if (!hasAvailableSlots) {
      setNextAvailableDate(addDays(selectedDate, 1));
    } else {
      setNextAvailableDate(null);
    }
    
    setLoading(false);
  };

  const getTimeSlotStatus = (slot: TimeSlot) => {
    if (!slot.available) return "booked";
    if (selectedTime === slot.time) return "selected";
    return "available";
  };

  const getTimeSlotIcon = (slot: TimeSlot) => {
    switch (getTimeSlotStatus(slot)) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "booked":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "selected":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTimeSlotBadge = (slot: TimeSlot) => {
    switch (getTimeSlotStatus(slot)) {
      case "available":
        return <Badge variant="outline" className="text-green-600 border-green-600">Available</Badge>;
      case "booked":
        return <Badge variant="secondary" className="text-red-600">Booked</Badge>;
      case "selected":
        return <Badge variant="default">Selected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Time Slots</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAvailability}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Checking availability...</span>
        </div>
      ) : (
        <>
          {nextAvailableDate && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  No slots available for {format(selectedDate, "PPP")}. 
                  Next available: {format(nextAvailableDate, "PPP")}
                </span>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <Card
                key={slot.time}
                className={`p-3 cursor-pointer transition-all ${
                  getTimeSlotStatus(slot) === "selected" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : slot.available 
                    ? "hover:shadow-md hover:bg-green-50" 
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => slot.available && onTimeSelect(slot.time)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{slot.time}</span>
                    {getTimeSlotIcon(slot)}
                  </div>
                  
                  {slot.doctor && slot.available && (
                    <p className="text-xs text-muted-foreground">
                      {slot.doctor}
                    </p>
                  )}
                  
                  {getTimeSlotBadge(slot)}
                </div>
              </Card>
            ))}
          </div>

          {timeSlots.filter(slot => slot.available).length === 0 && !nextAvailableDate && (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No available slots for this date.</p>
              <p className="text-sm">Please try another date.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityChecker;
