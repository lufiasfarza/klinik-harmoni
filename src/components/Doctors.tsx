import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService, Doctor as ApiDoctor, getStorageUrl } from "@/services/api";
import { toast } from "sonner";
import doctorSarah from "@/assets/doctor-sarah.jpg";
import doctorAhmad from "@/assets/doctor-ahmad.jpg";
import doctorMei from "@/assets/doctor-mei.jpg";
import doctorRaj from "@/assets/doctor-raj.jpg";
import doctorLisa from "@/assets/doctor-lisa.jpg";
import doctorDaniel from "@/assets/doctor-daniel.jpg";
import doctorCatherine from "@/assets/doctor-catherine.jpg";
import doctorMarcus from "@/assets/doctor-marcus.jpg";
import doctorPriya from "@/assets/doctor-priya.jpg";
import doctorFarid from "@/assets/doctor-farid.jpg";

interface Doctor extends ApiDoctor {
  image: string;
  branch?: string;
  bio?: string;
}

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log('Fetching doctors from API...');
        const response = await apiService.getDoctors();
        console.log('Doctors API Response:', response);
        
        if (response.success && response.data) {
          // Transform API data to include UI-specific fields
          const transformedDoctors: Doctor[] = response.data.map((apiDoctor, index) => {
            const doctorPhotos = [
              doctorSarah, doctorAhmad, doctorMei, doctorRaj, doctorLisa,
              doctorDaniel, doctorCatherine, doctorMarcus, doctorPriya, doctorFarid
            ];

            return {
              ...apiDoctor,
              image: getStorageUrl(apiDoctor.profile_image) || doctorPhotos[index % doctorPhotos.length],
              branch: apiDoctor.branch?.name,
              bio: apiDoctor.bio,
            };
          });
          
          console.log('Transformed doctors:', transformedDoctors);
          setDoctors(transformedDoctors);
        } else {
          console.error('Doctors API Error:', response);
          setError('Failed to load doctors');
          toast.error('Failed to load doctors data');
        }
      } catch (err) {
        console.error('Doctors Network Error:', err);
        setError('Network error');
        toast.error('Network error while loading doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  return (
    <section id="doctors" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Meet Our Experts
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted professionals dedicated to your health and recovery
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading doctors...</span>
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

        {/* Doctors Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {doctors.map((doctor, index) => (
            <Card 
              key={doctor.id}
              className="overflow-hidden hover-lift border-0 shadow-card group cursor-pointer transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/doctor/${doctor.id}`)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  {doctor.title && (
                    <Badge className="mb-2 bg-primary text-primary-foreground">{doctor.title}</Badge>
                  )}
                  <h3 className="text-xl font-heading font-semibold text-background mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-background/90">{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {doctor.bio}
                </p>
                
                <div className="space-y-2">
                  {doctor.branch && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{doctor.branch}</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/doctor/${doctor.id}`);
                  }}
                >
                  View Full Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
