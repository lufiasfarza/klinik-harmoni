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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // API integration point - ready for Laravel backend
    console.log("Booking submission:", { ...formData, date });
    
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
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <SelectTrigger>
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
              </div>

              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor">{t('booking.doctor')} *</Label>
                <Select value={formData.doctor} onValueChange={(value) => handleChange("doctor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('booking.selectDoctor')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-alicia">Dr. Alicia Tan</SelectItem>
                    <SelectItem value="ahmad">Ahmad Zulkifli</SelectItem>
                    <SelectItem value="any">Any Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">{t('booking.service')} *</Label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('booking.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                    <SelectItem value="massage">Therapeutic Massage</SelectItem>
                    <SelectItem value="consultation">Medical Consultation</SelectItem>
                  </SelectContent>
                </Select>
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
                        !date && "text-muted-foreground"
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
              </div>

              {/* Time Selection */}
              <div className="space-y-2 md:col-span-2">
              <Label htmlFor="time">{t('booking.time')} *</Label>
              <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                <SelectTrigger>
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('booking.phone')} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">{t('booking.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              {t('booking.submit')}
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
