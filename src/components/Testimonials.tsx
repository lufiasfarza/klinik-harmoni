import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

// Import patient photos
import patientSarah from "@/assets/patient-sarah.jpg";
import patientRahman from "@/assets/patient-rahman.jpg";
import patientMichelle from "@/assets/patient-michelle.jpg";
import patientJames from "@/assets/patient-james.jpg";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  photo: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Lee",
    location: "Kuala Lumpur",
    rating: 5,
    text: "Excellent physiotherapy service! Dr. Alicia helped me recover from my sports injury much faster than expected. The facilities are modern and the staff is very professional.",
    service: "Physiotherapy",
    photo: patientSarah
  },
  {
    id: 2,
    name: "Rahman Abdullah",
    location: "Petaling Jaya",
    rating: 5,
    text: "Best therapeutic massage I've ever had. The therapists are skilled and the ambiance is so relaxing. I come here monthly for stress relief.",
    service: "Therapeutic Massage",
    photo: patientRahman
  },
  {
    id: 3,
    name: "Michelle Tan",
    location: "Bangsar",
    rating: 5,
    text: "Very thorough medical consultation. The doctor took time to understand my concerns and provided a comprehensive treatment plan. Highly recommended!",
    service: "Medical Consultation",
    photo: patientMichelle
  },
  {
    id: 4,
    name: "James Wong",
    location: "Mont Kiara",
    rating: 5,
    text: "The booking system is so convenient and the clinic is always clean and well-maintained. Staff are friendly and professional throughout my visit.",
    service: "Physiotherapy",
    photo: patientJames
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">Patient Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real experiences from real people who trust us with their health
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`p-8 transition-all duration-500 hover-lift bg-card border-0 shadow-card relative overflow-hidden ${
                  index === currentIndex ? "ring-2 ring-primary/50 shadow-elevated" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 opacity-5">
                  <Quote className="h-24 w-24 text-primary" />
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-8 leading-relaxed text-base relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Patient Info with Photo */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="relative">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-soft"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-card flex items-center justify-center">
                      <Star className="h-3 w-3 fill-white text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-base">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                      <p className="text-xs font-medium text-primary">{testimonial.service}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-10 bg-primary shadow-soft" : "w-2.5 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
