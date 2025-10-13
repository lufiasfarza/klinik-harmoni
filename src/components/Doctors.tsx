import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import doctorSarah from "@/assets/doctor-sarah.jpg";
import doctorAhmad from "@/assets/doctor-ahmad.jpg";
import doctorMei from "@/assets/doctor-mei.jpg";

interface Doctor {
  id: string;
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
    id: "sarah-lim",
    name: "Dr. Sarah Lim",
    role: "Medical Director",
    specialization: "General Practice & Family Medicine",
    image: doctorSarah,
    branch: "KL Central",
    schedule: "Mon-Sat: 9:00 AM - 8:00 PM",
    bio: "15+ years of experience in family medicine and preventive care."
  },
  {
    id: "ahmad-razak",
    name: "Dr. Ahmad Razak",
    role: "Senior General Practitioner",
    specialization: "Internal Medicine",
    image: doctorAhmad,
    branch: "Petaling Jaya",
    schedule: "Mon-Sat: 9:00 AM - 8:00 PM",
    bio: "Specializing in chronic disease management and holistic care."
  },
  {
    id: "mei-chen",
    name: "Dr. Mei Chen",
    role: "Consultant Physician",
    specialization: "Women's Health & Pediatrics",
    image: doctorMei,
    branch: "Bangsar",
    schedule: "Mon-Fri: 10:00 AM - 7:00 PM",
    bio: "Dedicated to compassionate care for mothers and children."
  }
];

const Doctors = () => {
  const navigate = useNavigate();
  
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doctorsData.map((doctor, index) => (
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
                  <Badge className="mb-2 bg-primary text-primary-foreground">{doctor.role}</Badge>
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
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{doctor.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{doctor.schedule}</span>
                  </div>
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
      </div>
    </section>
  );
};

export default Doctors;
