import { Card } from "@/components/ui/card";
import { Star, Quote, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiService, Testimonial as ApiTestimonial, getStorageUrl } from "@/services/api";

// Import fallback patient photos
import patientSarah from "@/assets/patient-sarah.jpg";
import patientRahman from "@/assets/patient-rahman.jpg";
import patientMichelle from "@/assets/patient-michelle.jpg";
import patientJames from "@/assets/patient-james.jpg";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  rating: number;
  text: string;
  service?: string;
  photo: string;
}

// Fallback data if API returns empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Lee",
    title: "Kuala Lumpur",
    rating: 5,
    text: "Excellent service! The doctors are very professional and caring. I always feel comfortable and well taken care of. Highly recommended!",
    service: "General Consultation",
    photo: patientSarah
  },
  {
    id: 2,
    name: "Rahman Abdullah",
    title: "Petaling Jaya",
    rating: 5,
    text: "Best clinic experience I've ever had. The staff are skilled and friendly. I come here for all my family's healthcare needs.",
    service: "Health Screening",
    photo: patientRahman
  },
  {
    id: 3,
    name: "Michelle Tan",
    title: "Bangsar",
    rating: 5,
    text: "Very thorough medical consultation. The doctor took time to understand my concerns and provided a comprehensive treatment plan.",
    service: "Medical Consultation",
    photo: patientMichelle
  },
  {
    id: 4,
    name: "James Wong",
    title: "Mont Kiara",
    rating: 5,
    text: "The booking system is so convenient and the clinic is always clean and well-maintained. Professional service throughout.",
    service: "Vaccination",
    photo: patientJames
  }
];

const fallbackPhotos = [patientSarah, patientRahman, patientMichelle, patientJames];

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiService.getFeaturedTestimonials();
        if (response.success && response.data && response.data.length > 0) {
          const transformedTestimonials: Testimonial[] = response.data.map((t: ApiTestimonial, index: number) => ({
            id: t.id,
            name: t.patient_name,
            title: t.patient_title || '',
            rating: t.rating,
            text: t.message,
            service: t.service?.name,
            photo: getStorageUrl(t.patient_image) || fallbackPhotos[index % fallbackPhotos.length]
          }));
          setTestimonials(transformedTestimonials);
        }
        // If API returns empty, keep fallback data
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">{t('testimonials.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
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
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                  {testimonial.service && (
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                        <p className="text-xs font-medium text-primary">{testimonial.service}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
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
