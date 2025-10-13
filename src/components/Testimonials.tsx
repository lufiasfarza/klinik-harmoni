import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Lee",
    location: "Kuala Lumpur",
    rating: 5,
    text: "Excellent physiotherapy service! Dr. Alicia helped me recover from my sports injury much faster than expected. The facilities are modern and the staff is very professional.",
    service: "Physiotherapy"
  },
  {
    id: 2,
    name: "Rahman Abdullah",
    location: "Petaling Jaya",
    rating: 5,
    text: "Best therapeutic massage I've ever had. The therapists are skilled and the ambiance is so relaxing. I come here monthly for stress relief.",
    service: "Therapeutic Massage"
  },
  {
    id: 3,
    name: "Michelle Tan",
    location: "Bangsar",
    rating: 5,
    text: "Very thorough medical consultation. The doctor took time to understand my concerns and provided a comprehensive treatment plan. Highly recommended!",
    service: "Medical Consultation"
  },
  {
    id: 4,
    name: "James Wong",
    location: "Mont Kiara",
    rating: 5,
    text: "The booking system is so convenient and the clinic is always clean and well-maintained. Staff are friendly and professional throughout my visit.",
    service: "Physiotherapy"
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
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real experiences from real people who trust us with their health
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonialsData.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`p-8 transition-all duration-500 border-0 shadow-card ${
                  index === currentIndex ? "ring-2 ring-primary scale-105" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{testimonial.service}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
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
