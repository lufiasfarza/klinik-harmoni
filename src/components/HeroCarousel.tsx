import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiService, Banner } from "@/services/api";
import LazyImage from "@/components/LazyImage";
import promoVaccines from "@/assets/promo-vaccines.jpg";
import promoHealthCheck from "@/assets/promo-health-check.jpg";
import promoPhysio from "@/assets/promo-physio.jpg";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  badge?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: promoVaccines,
    title: "Special Vaccine Package",
    subtitle: "Protect your family with our comprehensive vaccination program. Limited time offer - 20% off all vaccines.",
    cta: "Book Now",
    ctaLink: "#booking",
    badge: "Promo"
  },
  {
    id: 2,
    image: promoHealthCheck,
    title: "Complete Health Check Bundle",
    subtitle: "Full body screening with advanced diagnostics. Early detection for better health outcomes.",
    cta: "See Packages",
    ctaLink: "#services",
    badge: "Popular"
  },
  {
    id: 3,
    image: promoPhysio,
    title: "Premium Physiotherapy Sessions",
    subtitle: "Expert rehabilitation and pain management. First session 30% off for new patients.",
    cta: "Learn More",
    ctaLink: "#services",
    badge: "New"
  }
];

const HeroCarousel = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiService.getBanners();
        if (response.success && response.data && response.data.length > 0) {
          const apiSlides: Slide[] = response.data.map((banner: Banner) => ({
            id: banner.id,
            image: banner.image || promoVaccines,
            title: banner.title,
            subtitle: banner.subtitle || banner.description || '',
            cta: banner.button_text || t('hero.bookAppointment'),
            ctaLink: banner.button_url || '#booking',
            badge: undefined
          }));
          setSlides(apiSlides);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [t, i18n.language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-muted">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <LazyImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  {slide.badge && (
                    <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold bg-secondary text-secondary-foreground animate-bounce">
                      {slide.badge}
                    </Badge>
                  )}
                  <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in">
                    {slide.subtitle}
                  </p>
                  <a href={slide.ctaLink}>
                    <Button
                      size="lg"
                      className="bg-background text-primary hover:bg-background/90 hover:scale-105 transition-all shadow-elevated animate-scale-in"
                    >
                      {slide.cta}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-all shadow-elevated backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-all shadow-elevated backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
