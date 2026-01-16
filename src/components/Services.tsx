import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Baby, Syringe, ScanLine, Heart, Users, Scissors, UserPlus, TestTube2, Shield, FlaskConical, Stethoscope, Activity, Target, Scale, User, Loader2, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiService, Service as ApiService } from "@/services/api";
import { toast } from "sonner";
import ServiceDetailModal from "./ServiceDetailModal";
import { useTranslation } from "react-i18next";

interface Service extends ApiService {
  title: string;
  icon: LucideIcon;
}

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
        const [servicesResponse, categoriesResponse] = await Promise.all([
          apiService.getServices(),
          apiService.getServiceCategories()
        ]);
        console.log('Services API Response:', servicesResponse);
        
        if (servicesResponse.success && servicesResponse.data) {
          // Transform API data to include UI-specific fields
          const transformedServices: Service[] = servicesResponse.data.map((apiService, index) => {
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
          if (categoriesResponse.success && categoriesResponse.data) {
            setCategories(categoriesResponse.data);
          } else {
            const derivedCategories = Array.from(
              new Set(transformedServices.map((service) => service.category).filter(Boolean))
            ) as string[];
            setCategories(derivedCategories);
          }
        } else {
          console.error('Services API Error:', servicesResponse);
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

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = activeCategory === "all" || service.category === activeCategory;
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        (service.short_description || "").toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchTerm]);

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t("services.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("services.description")}
          </p>
        </div>

        {!loading && !error && (
          <div className="max-w-5xl mx-auto mb-12 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("services.searchPlaceholder")}
                className="pl-10 py-6 bg-background"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                {t("services.allCategories")}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t("services.loading")}</span>
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
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className="overflow-hidden hover-lift border-0 shadow-card group cursor-pointer transition-all h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openServiceDetail(service)}
                >
                  <div className="p-8 text-center flex flex-col h-full">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="mt-6 flex-1 space-y-3">
                      {service.category && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {service.category}
                        </span>
                      )}
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      {service.short_description && (
                        <p className="text-muted-foreground text-sm leading-relaxed min-h-[72px]">
                          {service.short_description}
                        </p>
                      )}
                      {service.show_price && service.price_range && (
                        <div className="flex items-center justify-center text-sm">
                          <span className="text-primary font-semibold">
                            {service.price_range}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-6"
                    >
                      {t("services.learnMore")}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("services.noResults")}</p>
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
