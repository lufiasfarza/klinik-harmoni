import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Syringe, ScanLine, Heart, Users, Scissors, UserPlus, TestTube2, Shield, FlaskConical, Stethoscope, Activity, Target, Scale, User, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiService, Service as ApiService } from "@/services/api";
import { toast } from "sonner";
import ServiceDetailModal from "./ServiceDetailModal";

interface Service extends ApiService {
  title: string;
  icon: LucideIcon;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services from API...');
        const response = await apiService.getServices();
        console.log('Services API Response:', response);
        
        if (response.success && response.data) {
          // Transform API data to include UI-specific fields
          const transformedServices: Service[] = response.data.map((apiService, index) => {
            // Map service icons
            const serviceIcons: LucideIcon[] = [
              Stethoscope, Heart, Baby, Syringe, ScanLine, 
              Users, Scissors, UserPlus, TestTube2, Shield, 
              FlaskConical, Activity, Target, Scale, User
            ];
            
            return {
              ...apiService,
              title: apiService.name,
              icon: serviceIcons[index % serviceIcons.length],
            };
          });
          
          console.log('Transformed services:', transformedServices);
          setServices(transformedServices);
        } else {
          console.error('Services API Error:', response);
          setError('Failed to load services');
          toast.error('Failed to load services data');
        }
      } catch (err) {
        console.error('Services Network Error:', err);
        setError('Network error');
        toast.error('Network error while loading services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openServiceDetail = async (service: Service) => {
    setSelectedService(service);
    setIsLoadingDetail(true);
    try {
      const response = await apiService.getService(service.slug);
      if (response.success && response.data) {
        setSelectedService({ ...response.data, title: service.title, icon: service.icon });
      }
    } catch (error) {
      console.error("Failed to load service detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive healthcare services tailored to your needs
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className="overflow-hidden hover-lift border-0 shadow-card group cursor-pointer transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openServiceDetail(service)}
                >
                  <div className="p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      {service.short_description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {service.short_description}
                        </p>
                      )}
                      {service.show_price && service.price_range && (
                        <div className="flex items-center justify-end text-sm">
                          <span className="text-primary font-semibold">
                            {service.price_range}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Service Details Modal */}
        <ServiceDetailModal
          open={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          isLoading={isLoadingDetail}
          onBookAppointment={() => {
            setSelectedService(null);
            // Scroll to booking section
            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
    </section>
  );
};

export default Services;
