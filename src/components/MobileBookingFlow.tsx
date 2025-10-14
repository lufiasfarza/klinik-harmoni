import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiService, Service } from "@/services/api";

interface MobileBookingFlowProps {
  onComplete: (bookingData: any) => void;
  onClose: () => void;
}

const MobileBookingFlow = ({ onComplete, onClose }: MobileBookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    branch: "",
    service: "",
    date: null as Date | null,
    time: "",
    name: "",
    phone: "",
    email: "",
  });

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiService.getServices();
        if (response.success && response.data) {
          setServices(response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const steps = [
    { id: 1, title: "Location", icon: MapPin },
    { id: 2, title: "Service", icon: Calendar },
    { id: 3, title: "Time", icon: Clock },
    { id: 4, title: "Details", icon: User },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(bookingData);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return bookingData.branch !== "";
      case 1:
        return bookingData.service !== "";
      case 2:
        return bookingData.date !== null && bookingData.time !== "";
      case 3:
        return bookingData.name !== "" && bookingData.phone !== "";
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Branch</h3>
            <div className="space-y-2">
              {["KL Central", "Petaling Jaya", "Bangsar", "Mont Kiara"].map((branch) => (
                <Card
                  key={branch}
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    bookingData.branch === branch ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                  )}
                  onClick={() => setBookingData(prev => ({ ...prev, branch }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">{branch}</span>
                    </div>
                    {bookingData.branch === branch && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Service</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading services...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      bookingData.service === service.name ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                    onClick={() => setBookingData(prev => ({ ...prev, service: service.name }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{service.price_range_display}</p>
                        {bookingData.service === service.name && (
                          <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
            
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((dayOffset) => {
                  const date = new Date();
                  date.setDate(date.getDate() + dayOffset);
                  const isSelected = bookingData.date && 
                    bookingData.date.toDateString() === date.toDateString();
                  
                  return (
                    <Button
                      key={dayOffset}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingData(prev => ({ ...prev, date }))}
                      className="flex flex-col h-auto py-3"
                    >
                      <span className="text-xs">{format(date, "EEE")}</span>
                      <span className="font-medium">{format(date, "d")}</span>
                      <span className="text-xs">{format(date, "MMM")}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <div className="grid grid-cols-2 gap-2">
                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                  <Button
                    key={time}
                    variant={bookingData.time === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBookingData(prev => ({ ...prev, time }))}
                    disabled={!bookingData.date}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border rounded-lg mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border rounded-lg mt-1"
                  placeholder="+60 12-345 6789"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email (Optional)</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border rounded-lg mt-1"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Booking Summary */}
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Branch:</strong> {bookingData.branch}</p>
                <p><strong>Service:</strong> {bookingData.service}</p>
                <p><strong>Date:</strong> {bookingData.date ? format(bookingData.date, "PPP") : "Not selected"}</p>
                <p><strong>Time:</strong> {bookingData.time || "Not selected"}</p>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs",
                  isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isActive ? "bg-primary text-primary-foreground" : 
                  isCompleted ? "bg-green-100 text-green-600" : 
                  "bg-muted"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-center">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="flex-1"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid(currentStep)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileBookingFlow;
