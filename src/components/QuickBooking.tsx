import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { format } from "date-fns";
import { CalendarIcon, Phone, MapPin, Stethoscope, X, ChevronRight, ChevronLeft, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import SmartBranchSelector from "./SmartBranchSelector";
import AvailabilityChecker from "./AvailabilityChecker";
import BookingConfirmation from "./BookingConfirmation";

// Validation schema
const bookingSchema = z.object({
  branch: z.string().min(1, "Please select a branch"),
  service: z.string().min(1, "Please select a service"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time slot"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

interface QuickBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickBooking = ({ open, onOpenChange }: QuickBookingProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    branch: "",
    service: "",
    phone: "",
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  const totalSteps = 4;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1 && !formData.branch) {
      newErrors.branch = "Please select a branch";
    }
    if (currentStep === 2 && !formData.service) {
      newErrors.service = "Please select a service";
    }
    if (currentStep === 2 && !date) {
      newErrors.date = "Please select a date";
    }
    if (currentStep === 2 && !formData.time) {
      newErrors.time = "Please select a time slot";
    }
    if (currentStep === 3 && !formData.phone) {
      newErrors.phone = "Please enter your phone number";
    } else if (currentStep === 3 && formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (currentStep === 4 && !formData.name) {
      newErrors.name = "Please enter your full name";
    } else if (currentStep === 4 && formData.name && formData.name.length < 2) {
      newErrors.name = "Please enter a valid name";
    }
    if (currentStep === 4 && formData.email && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
        setErrors({});
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = bookingSchema.parse({ ...formData, date });
      
      // Generate booking ID
      const newBookingId = `EW${Date.now().toString().slice(-6)}`;
      setBookingId(newBookingId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Quick booking:", validatedData);
      toast.success(t('booking.success'));
      
      // Show confirmation
      setShowConfirmation(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check all fields");
      }
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setFormData({
      branch: "",
      service: "",
      phone: "",
      name: "",
      email: "",
    });
    setDate(undefined);
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (showConfirmation) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
          
          <div className="overflow-y-auto">
            <BookingConfirmation
              bookingData={{
                id: bookingId,
                branch: formData.branch,
                service: formData.service,
                date: date!,
                time: formData.time,
                patientName: formData.name,
                phone: formData.phone,
                email: formData.email,
                status: 'confirmed' as const,
              }}
              onClose={handleConfirmationClose}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DrawerClose>

        <DrawerHeader className="text-center border-b pb-4">
          <DrawerTitle className="text-2xl font-heading font-bold">
            Quick Appointment Booking
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Step {step} of {totalSteps}
          </DrawerDescription>
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4 justify-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index + 1 === step ? "w-12 bg-primary" : "w-8 bg-muted",
                  index + 1 < step && "bg-primary/50"
                )}
              />
            ))}
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Step 1: Branch Selection */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-xl font-semibold mb-2">Select Your Clinic</h3>
                  <p className="text-muted-foreground">Choose the branch nearest to you</p>
                </div>
                
                <SmartBranchSelector
                  onBranchSelect={(branchId) => handleChange("branch", branchId)}
                  selectedBranch={formData.branch}
                />
                
                {errors.branch && (
                  <p className="text-sm text-destructive mt-1">{errors.branch}</p>
                )}
              </div>
            )}

            {/* Step 2: Service and Date Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <Stethoscope className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-xl font-semibold mb-2">Choose Service & Date</h3>
                  <p className="text-muted-foreground">Select your preferred treatment and appointment date</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-base">
                    {t('booking.service')} *
                  </Label>
                  <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                    <SelectTrigger className={cn("h-14 text-base", errors.service && "border-destructive")}>
                      <SelectValue placeholder={t('booking.selectService')} />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="consultation">General Consultation</SelectItem>
                      <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                      <SelectItem value="massage">Therapeutic Massage</SelectItem>
                      <SelectItem value="vaccine">Vaccination</SelectItem>
                      <SelectItem value="health-check">Health Screening</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-sm text-destructive mt-1">{errors.service}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base">
                    {t('booking.date')} *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left text-base font-normal",
                          !date && "text-muted-foreground",
                          errors.date && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {date ? format(date, "PPP") : <span>{t('booking.pickDate')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          if (errors.date) {
                            setErrors(prev => ({ ...prev, date: "" }));
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-destructive mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Real-time Availability Checker */}
                {formData.branch && formData.service && date && (
                  <div className="mt-6">
                    <AvailabilityChecker
                      branchId={formData.branch}
                      serviceId={formData.service}
                      selectedDate={date}
                      onTimeSelect={(time) => handleChange("time", time)}
                      selectedTime={formData.time}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <Phone className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
                  <p className="text-muted-foreground">Enter your phone number for confirmation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    {t('booking.phone')} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+60 12-345 6789"
                    className={cn("h-14 text-base", errors.phone && "border-destructive")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <CalendarIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Our staff will contact you within 24 hours to confirm your appointment at <strong>{formData.branch.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</strong> for <strong>{formData.service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</strong> on <strong>{date ? format(date, "PPP") : "selected date"}</strong>.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Personal Details */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <User className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">Complete your booking details</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={cn("h-14 text-base", errors.name && "border-destructive")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className={cn("h-14 text-base", errors.email && "border-destructive")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="font-medium">{formData.branch.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{formData.service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{date ? format(date, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{formData.time || "Not selected"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 h-12 text-base"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 text-base hover:scale-105 transition-all"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base hover:scale-105 transition-all"
                >
                  {t('booking.submit')}
                </Button>
              )}
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuickBooking;
