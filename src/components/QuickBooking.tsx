import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Phone, MapPin, Stethoscope, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const QuickBooking = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    branch: "",
    service: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch || !formData.service || !date || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    console.log("Quick booking:", { ...formData, date });
    toast.success(t('booking.success'));
    
    // Reset form
    setFormData({
      branch: "",
      service: "",
      phone: "",
    });
    setDate(undefined);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-12 bg-background relative -mt-20 z-20 md:static">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto p-8 md:p-10 shadow-elevated border-0 rounded-2xl bg-card md:relative fixed bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto md:rounded-2xl rounded-t-2xl z-50 md:z-20 max-h-[90vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Quick Appointment Booking
            </h3>
            <p className="text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Our staff will contact you to confirm your appointment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Branch Selection */}
              <div className="space-y-2">
                <Label htmlFor="branch" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('booking.branch')} *
                </Label>
                <Select value={formData.branch} onValueChange={(value) => handleChange("branch", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('booking.selectBranch')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="kl-central">KL Central</SelectItem>
                    <SelectItem value="petaling-jaya">Petaling Jaya</SelectItem>
                    <SelectItem value="bangsar">Bangsar</SelectItem>
                    <SelectItem value="mont-kiara">Mont Kiara</SelectItem>
                    <SelectItem value="subang-jaya">Subang Jaya</SelectItem>
                    <SelectItem value="damansara">Damansara</SelectItem>
                    <SelectItem value="shah-alam">Shah Alam</SelectItem>
                    <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                    <SelectItem value="penang">Penang</SelectItem>
                    <SelectItem value="ipoh">Ipoh</SelectItem>
                    <SelectItem value="melaka">Melaka</SelectItem>
                    <SelectItem value="kota-kinabalu">Kota Kinabalu</SelectItem>
                    <SelectItem value="kuching">Kuching</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  {t('booking.service')} *
                </Label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="h-12">
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
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  {t('booking.date')} *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t('booking.pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background" align="start">
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
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {t('booking.phone')} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="h-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                {t('booking.submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default QuickBooking;
