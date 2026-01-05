import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiService } from "@/services/api";

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string | null;
}

interface AvailabilityCheckerProps {
  branchSlug: string;
  selectedDate: Date | null;
  doctorId?: number;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const AvailabilityChecker = ({
  branchSlug,
  selectedDate,
  doctorId,
  onTimeSelect,
  selectedTime,
}: AvailabilityCheckerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!branchSlug || !selectedDate) {
        setTimeSlots([]);
        return;
      }

      setLoading(true);
      try {
        const response = await apiService.getBranchSlots(
          branchSlug,
          format(selectedDate, "yyyy-MM-dd"),
          doctorId
        );
        if (response.success && response.data) {
          setTimeSlots(response.data);
        } else {
          setTimeSlots([]);
        }
      } catch (error) {
        console.error("Failed to load slots:", error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [branchSlug, selectedDate, doctorId]);

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
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Checking availability...</span>
        </div>
      ) : (
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
                {getTimeSlotBadge(slot)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && timeSlots.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No available slots for this date.</p>
          <p className="text-sm">Please try another date.</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityChecker;
