import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
}

const branchesData: Branch[] = [
  {
    id: 1,
    name: "Elite Wellness KL Central",
    address: "Level 5, Pavilion KL, 168 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    phone: "+603-2142 8888",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM",
    mapUrl: "https://maps.google.com/?q=Pavilion+KL"
  },
  {
    id: 2,
    name: "Elite Wellness Petaling Jaya",
    address: "G-03, Jaya One, 72A Jalan Universiti, 46200 Petaling Jaya, Selangor",
    phone: "+603-7932 5555",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM | Sun: Closed",
    mapUrl: "https://maps.google.com/?q=Jaya+One+PJ"
  },
  {
    id: 3,
    name: "Elite Wellness Bangsar",
    address: "Unit 10-1, Bangsar Village II, 2 Jalan Telawi 1, 59100 Bangsar, KL",
    phone: "+603-2282 3333",
    hours: "Mon-Fri: 10:00 AM - 7:00 PM | Sat-Sun: 10:00 AM - 6:00 PM",
    mapUrl: "https://maps.google.com/?q=Bangsar+Village+II"
  },
  {
    id: 4,
    name: "Elite Wellness Mont Kiara",
    address: "163 Retail Park, 2 Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur",
    phone: "+603-6211 7777",
    hours: "Mon-Sat: 9:00 AM - 9:00 PM | Sun: 10:00 AM - 6:00 PM",
    mapUrl: "https://maps.google.com/?q=163+Retail+Park+Mont+Kiara"
  },
  {
    id: 5,
    name: "Elite Wellness Subang Jaya",
    address: "LG-15 Empire Shopping Gallery, Jalan SS 16/1, 47500 Subang Jaya",
    phone: "+603-5637 4444",
    hours: "Mon-Sat: 10:00 AM - 9:00 PM | Sun: 10:00 AM - 7:00 PM",
    mapUrl: "https://maps.google.com/?q=Empire+Shopping+Gallery"
  },
  {
    id: 6,
    name: "Elite Wellness Damansara",
    address: "A-G-5, Menara UOA Bangsar, 5 Jalan Bangsar Utama 1, 59000 KL",
    phone: "+603-2287 1111",
    hours: "Mon-Fri: 9:00 AM - 7:00 PM | Sat: 9:00 AM - 5:00 PM | Sun: Closed",
    mapUrl: "https://maps.google.com/?q=Menara+UOA+Bangsar"
  }
];

const Branches = () => {
  return (
    <section id="branches" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our Locations
          </h2>
          <p className="text-lg text-muted-foreground">
            11 branches across Malaysia, bringing quality healthcare closer to you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchesData.map((branch, index) => (
            <Card 
              key={branch.id}
              className="p-6 hover-lift border-0 shadow-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                  {branch.name}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{branch.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${branch.phone}`} 
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </div>
                  
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{branch.hours}</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => window.open(branch.mapUrl, '_blank')}
              >
                View on Map
              </Button>
            </Card>
          ))}
          
          {/* Placeholder cards for remaining branches */}
          {[7, 8, 9, 10, 11].map((num) => (
            <Card 
              key={num}
              className="p-6 border-0 shadow-card bg-gradient-to-br from-primary/5 to-secondary/5"
            >
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Branch {num}</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Coming Soon</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branches;
