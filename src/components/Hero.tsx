import { Calendar, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-clinic.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern Elite Wellness Clinic interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary-dark/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 mb-6">
              <Award className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">Award-Winning Healthcare Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
              Your Journey to <span className="block text-primary-light">Complete Wellness</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Experience world-class healthcare across 11 branches nationwide. Professional physiotherapy, holistic treatments, and compassionate care tailored to your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 shadow-elevated group"
              >
                <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Book Appointment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Find a Branch
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl">
              <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-1">11+</div>
                <div className="text-sm text-primary-foreground/80">Branches</div>
              </div>
              <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-1">50+</div>
                <div className="text-sm text-primary-foreground/80">Specialists</div>
              </div>
              <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-1">10K+</div>
                <div className="text-sm text-primary-foreground/80">Happy Patients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
