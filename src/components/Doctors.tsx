import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";

interface Doctor {
  id: number;
  name: string;
  role: string;
  specialization: string;
  image: string;
  branch: string;
  schedule: string;
  bio: string;
}

const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Alicia Tan",
    role: "Medical Director",
    specialization: "Pain Management & Rehabilitation",
    image: doctor1,
    branch: "Kuala Lumpur Central",
    schedule: "Mon - Fri, 9:00 AM - 5:00 PM",
    bio: "15+ years of experience in advanced pain management and post-operative rehabilitation."
  },
  {
    id: 2,
    name: "Ahmad Zulkifli",
    role: "Senior Physiotherapist",
    specialization: "Sports Medicine & Injury Prevention",
    image: doctor2,
    branch: "Petaling Jaya",
    schedule: "Tue - Sat, 10:00 AM - 6:00 PM",
    bio: "Certified sports physiotherapist specializing in athletic performance and injury recovery."
  },
];

const Doctors = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {doctorsData.map((doctor, index) => (
            <Card 
              key={doctor.id}
              className="overflow-hidden hover-lift border-0 shadow-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 to-transparent p-6">
                  <Badge className="mb-2 bg-primary text-primary-foreground">{doctor.role}</Badge>
                  <h3 className="text-2xl font-heading font-semibold text-background mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-background/80">{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  {doctor.bio}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{doctor.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{doctor.schedule}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
