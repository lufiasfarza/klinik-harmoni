import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { apiService, handleApiError } from "@/services/api";

// Enhanced validation schema
const bookingSchema = z.object({
  branch: z.string().min(1, "Please select a branch"),
  doctor: z.string().min(1, "Please select a doctor"),
  service: z.string().min(1, "Please select a service"),
  time: z.string().min(1, "Please select a time"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
});

const Booking = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    branch: "",
    doctor: "",
    service: "",
    time: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const validatedData = bookingSchema.parse({ ...formData, date });
      
      // Sanitize input data
      const sanitizedData = {
        ...validatedData,
        name: validatedData.name.trim(),
        email: validatedData.email.toLowerCase().trim(),
        phone: validatedData.phone.replace(/\D/g, ''), // Remove non-digits
      };
      
      // Call API service
      const response = await apiService.createBooking(sanitizedData);
      
      if (response.success) {
        toast.success(t('booking.success'));
        
        // Reset form
        setFormData({
          branch: "",
          doctor: "",
          service: "",
          time: "",
          name: "",
          phone: "",
          email: "",
        });
        setDate(undefined);
        setErrors({});
      } else {
        toast.error(handleApiError(response));
        if (response.errors) {
          setErrors(response.errors);
        }
      }
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
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t('booking.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('booking.description')}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 shadow-elevated border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Branch Selection */}
              <div className="space-y-2">
                <Label htmlFor="branch">{t('booking.branch')} *</Label>
                <Select value={formData.branch} onValueChange={(value) => handleChange("branch", value)}>
                  <SelectTrigger className={errors.branch ? "border-destructive" : ""}>
                    <SelectValue placeholder={t('booking.selectBranch')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kl-central">KL Central</SelectItem>
                    <SelectItem value="petaling-jaya">Petaling Jaya</SelectItem>
                    <SelectItem value="bangsar">Bangsar</SelectItem>
                    <SelectItem value="mont-kiara">Mont Kiara</SelectItem>
                    <SelectItem value="subang-jaya">Subang Jaya</SelectItem>
                    <SelectItem value="damansara">Damansara</SelectItem>
                  </SelectContent>
                </Select>
                {errors.branch && <p className="text-sm text-destructive">{errors.branch}</p>}
              </div>

              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor">{t('booking.doctor')} *</Label>
                <Select value={formData.doctor} onValueChange={(value) => handleChange("doctor", value)}>
                  <SelectTrigger className={errors.doctor ? "border-destructive" : ""}>
                    <SelectValue placeholder={t('booking.selectDoctor')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-alicia">Dr. Alicia Tan</SelectItem>
                    <SelectItem value="ahmad">Ahmad Zulkifli</SelectItem>
                    <SelectItem value="any">Any Available</SelectItem>
                  </SelectContent>
                </Select>
                {errors.doctor && <p className="text-sm text-destructive">{errors.doctor}</p>}
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">{t('booking.service')} *</Label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className={errors.service ? "border-destructive" : ""}>
                    <SelectValue placeholder={t('booking.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                    <SelectItem value="massage">Therapeutic Massage</SelectItem>
                    <SelectItem value="consultation">Medical Consultation</SelectItem>
                  </SelectContent>
                </Select>
                {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label>{t('booking.date')} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t('booking.pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              {/* Time Selection */}
              <div className="space-y-2 md:col-span-2">
              <Label htmlFor="time">{t('booking.time')} *</Label>
              <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                <SelectTrigger className={errors.time ? "border-destructive" : ""}>
                  <SelectValue placeholder={t('booking.selectTime')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-6">
              <h3 className="font-heading font-semibold text-lg">Your Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('booking.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('booking.phone')} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                    required
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">{t('booking.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : t('booking.submit')}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              You will receive a confirmation email and WhatsApp message shortly after booking.
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Booking;