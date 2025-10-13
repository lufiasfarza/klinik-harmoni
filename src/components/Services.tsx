import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import servicePhysio from "@/assets/service-physio.jpg";
import serviceMassage from "@/assets/service-massage.jpg";
import serviceConsultation from "@/assets/service-consultation.jpg";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  details: string[];
  duration: string;
}

const servicesData: Service[] = [
  {
    id: 1,
    title: "Physiotherapy",
    description: "Expert rehabilitation and pain management for optimal recovery and mobility.",
    price: "RM 120 - RM 200",
    image: servicePhysio,
    duration: "45-60 minutes",
    details: [
      "Post-surgery rehabilitation",
      "Sports injury treatment",
      "Chronic pain management",
      "Posture correction therapy",
      "Manual therapy techniques",
      "Customized exercise programs"
    ]
  },
  {
    id: 2,
    title: "Therapeutic Massage",
    description: "Relaxing and healing massage therapies for stress relief and muscle tension.",
    price: "RM 80 - RM 150",
    image: serviceMassage,
    duration: "60-90 minutes",
    details: [
      "Deep tissue massage",
      "Swedish massage",
      "Trigger point therapy",
      "Lymphatic drainage",
      "Hot stone therapy",
      "Aromatherapy treatment"
    ]
  },
  {
    id: 3,
    title: "Medical Consultation",
    description: "Comprehensive medical assessments and personalized treatment plans.",
    price: "RM 100 - RM 180",
    image: serviceConsultation,
    duration: "30-45 minutes",
    details: [
      "General health screening",
      "Specialist consultations",
      "Health risk assessment",
      "Diagnostic imaging referrals",
      "Treatment planning",
      "Follow-up care coordination"
    ]
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive healthcare solutions tailored to your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <Card 
              key={service.id}
              className="overflow-hidden hover-lift cursor-pointer group border-0 shadow-card"
              onClick={() => setSelectedService(service)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Starting from</div>
                    <div className="text-xl font-semibold text-primary">{service.price}</div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-heading">{selectedService?.title}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Price Range</div>
                  <div className="text-lg font-semibold text-primary">{selectedService.price}</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="text-lg font-semibold text-foreground">{selectedService.duration}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">What's Included</h4>
                <div className="grid gap-2">
                  {selectedService.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg">
                Book This Service
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Services;
