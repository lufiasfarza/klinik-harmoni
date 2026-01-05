import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { apiService, handleApiError, Branch, Doctor, Service } from "@/services/api";

// Enhanced validation schema
const bookingSchema = z.object({
  branch_id: z.number().min(1, "Please select a branch"),
  service_id: z.number().min(1, "Please select a service"),
  doctor_id: z.number().optional(),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  patient_name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  patient_ic: z.string().min(5, "Please enter a valid IC/Passport"),
  contact_phone: z.string().regex(/^[+]?[\d\s\-()]{10,15}$/, "Invalid phone number"),
  contact_email: z.string().email("Invalid email address").optional(),
  symptoms_description: z.string().max(1000, "Notes too long").optional(),
});

const Booking = () => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    branch_id: 0,
    service_id: 0,
    doctor_id: 0,
    time: "",
    patient_name: "",
    patient_ic: "",
    contact_phone: "",
    contact_email: "",
    symptoms_description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedBranch = branches.find((branch) => branch.id === formData.branch_id);

  // Fetch branches and services from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching branches and services for booking...');
        
        const [branchesResponse, servicesResponse] = await Promise.all([
          apiService.getBranches(),
          apiService.getServices()
        ]);
        
        console.log('Branches Response:', branchesResponse);
        console.log('Services Response:', servicesResponse);
        
        if (branchesResponse.success && branchesResponse.data) {
          setBranches(branchesResponse.data.filter((branch) => branch.accepts_online_booking));
        } else {
          console.error('Failed to load branches:', branchesResponse);
          toast.error('Failed to load branches');
        }
        
        if (servicesResponse.success && servicesResponse.data) {
          setServices(servicesResponse.data);
        } else {
          console.error('Failed to load services:', servicesResponse);
          toast.error('Failed to load services');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        toast.error('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      if (!selectedBranch?.slug) {
        setDoctors([]);
        return;
      }

      try {
        const response = await apiService.getBranchDoctors(selectedBranch.slug);
        if (response.success && response.data) {
          setDoctors(response.data);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
        setDoctors([]);
      }
    };

    loadDoctors();
  }, [selectedBranch?.slug]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      doctor_id: 0,
      time: "",
    }));
  }, [formData.branch_id]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedBranch?.slug || !date) {
        setAvailableSlots([]);
        return;
      }

      try {
        const response = await apiService.getBranchSlots(
          selectedBranch.slug,
          format(date, "yyyy-MM-dd"),
          formData.doctor_id || undefined
        );
        if (response.success && response.data) {
          const slots = response.data
            .filter((slot) => slot.available)
            .map((slot) => slot.time);
          setAvailableSlots(slots);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Failed to load slots:", error);
        setAvailableSlots([]);
      }
    };

    loadSlots();
  }, [selectedBranch?.slug, date, formData.doctor_id]);

  useEffect(() => {
    if (formData.time && !availableSlots.includes(formData.time)) {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  }, [availableSlots, formData.time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const apiData = {
        branch_id: formData.branch_id,
        service_id: formData.service_id || undefined,
        doctor_id: formData.doctor_id || undefined,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: formData.time,
        patient_name: formData.patient_name.trim(),
        patient_ic: formData.patient_ic.trim(),
        contact_phone: formData.contact_phone.replace(/\D/g, ""),
        contact_email: formData.contact_email ? formData.contact_email.toLowerCase().trim() : undefined,
        symptoms_description: formData.symptoms_description?.trim() || undefined,
        preferred_language: (i18n.language.startsWith("en") ? "en" : "ms") as "ms" | "en",
      };
      
      // Validate form data
      const validatedData = bookingSchema.parse(apiData);
      
      // Call API service
      const response = await apiService.createBooking(validatedData);
      
      if (response.success) {
        toast.success(`Booking successful! Ref: ${response.data?.booking_reference}`);
        
        // Reset form
        setFormData({
          branch_id: 0,
          service_id: 0,
          doctor_id: 0,
          time: "",
          patient_name: "",
          patient_ic: "",
          contact_phone: "",
          contact_email: "",
          symptoms_description: "",
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

  const handleChange = (field: string, value: string | number) => {
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading booking form...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="branch">{t('booking.branch')} *</Label>
                    <Select value={formData.branch_id.toString()} onValueChange={(value) => handleChange("branch_id", parseInt(value))}>
                      <SelectTrigger className={errors.branch_id ? "border-destructive" : ""}>
                        <SelectValue placeholder={loading ? "Loading branches..." : t('booking.selectBranch')} />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.branch_id && <p className="text-sm text-destructive">{errors.branch_id}</p>}
                  </div>

              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor">{t('booking.doctor')}</Label>
                <Select value={formData.doctor_id.toString()} onValueChange={(value) => handleChange("doctor_id", parseInt(value, 10))}>
                  <SelectTrigger className={errors.doctor_id ? "border-destructive" : ""}>
                    <SelectValue placeholder={t('booking.selectDoctor')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('booking.anyDoctor')}</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor_id && <p className="text-sm text-destructive">{errors.doctor_id}</p>}
              </div>

                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service">{t('booking.service')} *</Label>
                    <Select value={formData.service_id.toString()} onValueChange={(value) => handleChange("service_id", parseInt(value))}>
                      <SelectTrigger className={errors.service_id ? "border-destructive" : ""}>
                        <SelectValue placeholder={loading ? "Loading services..." : t('booking.selectService')} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                            {service.show_price && service.price_range ? ` - ${service.price_range}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service_id && <p className="text-sm text-destructive">{errors.service_id}</p>}
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
                    {availableSlots.length === 0 && (
                      <SelectItem value="none" disabled>
                        {t('booking.noSlotsAvailable')}
                      </SelectItem>
                    )}
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
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
                    value={formData.patient_name}
                    onChange={(e) => handleChange("patient_name", e.target.value)}
                    className={errors.patient_name ? "border-destructive" : ""}
                    required
                  />
                  {errors.patient_name && <p className="text-sm text-destructive">{errors.patient_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_ic">{t('booking.ic') || "IC/Passport"} *</Label>
                  <Input
                    id="patient_ic"
                    type="text"
                    value={formData.patient_ic}
                    onChange={(e) => handleChange("patient_ic", e.target.value)}
                    className={errors.patient_ic ? "border-destructive" : ""}
                    required
                  />
                  {errors.patient_ic && <p className="text-sm text-destructive">{errors.patient_ic}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('booking.phone')} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    className={errors.contact_phone ? "border-destructive" : ""}
                    required
                  />
                  {errors.contact_phone && <p className="text-sm text-destructive">{errors.contact_phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('booking.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                    className={errors.contact_email ? "border-destructive" : ""}
                  />
                  {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="symptoms">{t('booking.notes')}</Label>
                  <Input
                    id="symptoms"
                    type="text"
                    value={formData.symptoms_description}
                    onChange={(e) => handleChange("symptoms_description", e.target.value)}
                    className={errors.symptoms_description ? "border-destructive" : ""}
                  />
                  {errors.symptoms_description && <p className="text-sm text-destructive">{errors.symptoms_description}</p>}
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
          )}
        </Card>
      </div>
    </section>
  );
};

export default Booking;
