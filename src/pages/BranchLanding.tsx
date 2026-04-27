import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2, MapPin, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import DynamicHead from "@/components/DynamicHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiService, BranchLandingData } from "@/services/api";

interface BranchLandingProps {
  source: "branch" | "campaign";
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const defaultServices = [
  "Demam",
  "Batuk dan selesema",
  "Sakit badan",
  "MC",
  "Rawatan luka ringan",
  "Sakit perut",
];

const branchName = (landing: BranchLandingData) => landing.branch?.name || landing.name || "Klinik Harmoni";
const branchAddress = (landing: BranchLandingData) => landing.branch?.address || landing.address || "";
const branchSlug = (landing: BranchLandingData) => landing.branch?.slug || landing.slug || "";

const trackCta = (landing: BranchLandingData, type: string, destination: string) => {
  const payload = {
    event: "landing_cta_click",
    cta_type: type,
    destination,
    branch_id: String(landing.branch?.id || landing.id || ""),
    branch_name: branchName(landing),
    branch_slug: branchSlug(landing),
    campaign_code: landing.campaign_code || "",
    page_path: window.location.pathname,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", "landing_cta_click", payload);
  }
};

const BranchLanding = ({ source }: BranchLandingProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [landing, setLanding] = useState<BranchLandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanding = async () => {
      if (!slug) {
        setError("Landing page not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = source === "campaign"
          ? await apiService.getCampaignLanding(slug)
          : await apiService.getBranchLanding(slug);

        if (response.success && response.data) {
          setLanding(response.data);
        } else {
          setError(response.message || "Landing page not found");
        }
      } catch (err) {
        console.error("Failed to load landing page:", err);
        setError("Unable to load landing page");
      } finally {
        setLoading(false);
      }
    };

    loadLanding();
  }, [slug, source]);

  const services = useMemo(() => {
    if (!landing?.services_list?.length) return defaultServices;
    return landing.services_list.map((service) => String(service)).filter(Boolean);
  }, [landing?.services_list]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading landing page...</p>
        </div>
      </div>
    );
  }

  if (error || !landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card className="max-w-md p-8 text-center shadow-card">
          <h1 className="text-2xl font-heading font-bold mb-3">Landing page not found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested page is unavailable."}</p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </Card>
      </div>
    );
  }

  const name = branchName(landing);
  const address = branchAddress(landing);
  const headline = landing.headline || `Sakit sekarang? Walk-in ${name}`;
  const subheadline = landing.subheadline || landing.short_description || "Doktor sedia membantu untuk rawatan harian, MC dan konsultasi umum. Hubungi klinik untuk semak keadaan semasa sebelum datang.";
  const metaTitle = landing.meta_title || `${name} | Walk-In Klinik Harmoni`;
  const metaDescription = landing.meta_description || subheadline;
  const heroImage = landing.hero_image_url || landing.featured_image || landing.gallery_image_urls?.[0];
  const gallery = landing.gallery_image_urls || landing.gallery_images || [];
  const testimonials = landing.testimonials || [];
  const rating = landing.average_rating;
  const reviewCount = landing.review_count || 0;

  const onCta = (type: string, destination?: string | null) => {
    if (destination) trackCta(landing, type, destination);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DynamicHead title={metaTitle} description={metaDescription} />

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <a href="/" className="font-heading text-lg font-bold text-foreground">
            Klinik Harmoni
          </a>
          <Badge className="bg-primary text-primary-foreground">Walk-In</Badge>
        </div>
      </header>

      <main className="pb-20 md:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
          {heroImage && (
            <img
              src={heroImage}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover opacity-20"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-dark/95" />
          <div className="container relative mx-auto grid gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-green-300" />
                Klinik beroperasi untuk walk-in
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">{headline}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
                {subheadline}
              </p>
              {address && (
                <div className="mt-5 flex items-start gap-3 text-primary-foreground/90">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {landing.whatsapp_link && (
                  <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#20BA5A]">
                    <a href={landing.whatsapp_link} target="_blank" rel="noopener noreferrer" onClick={() => onCta("whatsapp", landing.whatsapp_link)}>
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp Sekarang
                    </a>
                  </Button>
                )}
                {landing.call_link && (
                  <Button asChild size="lg" variant="secondary">
                    <a href={landing.call_link} onClick={() => onCta("call", landing.call_link)}>
                      <Phone className="h-5 w-5" />
                      Hubungi Klinik
                    </a>
                  </Button>
                )}
                {landing.maps_open_url && (
                  <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary">
                    <a href={landing.maps_open_url} target="_blank" rel="noopener noreferrer" onClick={() => onCta("directions", landing.maps_open_url)}>
                      <Navigation className="h-5 w-5" />
                      Buka Maps
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Card className="border-white/20 bg-white/95 p-6 text-foreground shadow-elevated">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-2xl font-bold text-primary">{rating ? rating.toFixed(1) : "24/7"}</div>
                  <div className="text-xs text-muted-foreground">{rating ? "Rating" : "Info"}</div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-2xl font-bold text-primary">{reviewCount > 0 ? `${reviewCount}+` : "MC"}</div>
                  <div className="text-xs text-muted-foreground">{reviewCount > 0 ? "Ulasan" : "Hari Sama"}</div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-2xl font-bold text-primary">Walk-In</div>
                  <div className="text-xs text-muted-foreground">Tanpa Temujanji</div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {["Daftar cepat di kaunter", "Rawatan kes umum harian", "Call atau WhatsApp sebelum datang"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Rawatan</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Rawatan yang ditawarkan</h2>
            <p className="mt-4 text-muted-foreground">
              Pilih klinik terdekat dan hubungi kami untuk semak waktu doktor, anggaran giliran dan kesesuaian rawatan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {services.map((service) => (
              <Badge key={service} variant="secondary" className="px-4 py-2 text-sm">
                {service}
              </Badge>
            ))}
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="bg-muted py-16">
            <div className="container mx-auto px-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Ulasan pesakit</p>
              <h2 className="mt-2 font-heading text-3xl font-bold">Dipercayai pesakit setempat</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <Card key={`${testimonial.name}-${index}`} className="p-6 shadow-card">
                    <div className="mb-4 flex gap-1 text-amber-500">
                      {Array.from({ length: Math.max(1, Math.min(5, testimonial.rating || 5)) }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.message}"</p>
                    <p className="mt-4 font-semibold">{testimonial.name}</p>
                    {testimonial.title && <p className="text-sm text-muted-foreground">{testimonial.title}</p>}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Suasana klinik</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Kenali cawangan ini</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {gallery.slice(0, 4).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${name} ${index + 1}`}
                  className="h-56 w-full rounded-lg object-cover shadow-card"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}

        {(landing.map_embed_url || landing.maps_open_url) && (
          <section className="bg-muted py-16">
            <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Lokasi</p>
                <h2 className="mt-2 font-heading text-3xl font-bold">Datang ke {name}</h2>
                {address && <p className="mt-4 text-muted-foreground">{address}</p>}
                {landing.maps_open_url && (
                  <Button asChild className="mt-6">
                    <a href={landing.maps_open_url} target="_blank" rel="noopener noreferrer" onClick={() => onCta("directions", landing.maps_open_url)}>
                      <Navigation className="h-4 w-4" />
                      Buka Google Maps
                    </a>
                  </Button>
                )}
              </div>
              {landing.map_embed_url && (
                <div className="overflow-hidden rounded-lg border bg-background shadow-card">
                  <iframe
                    src={landing.map_embed_url}
                    title={`Lokasi ${name}`}
                    className="h-[360px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 shadow-elevated backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {landing.call_link && (
            <Button asChild variant="outline">
              <a href={landing.call_link} onClick={() => onCta("call", landing.call_link)}>
                <Phone className="h-4 w-4" />
                Call
              </a>
            </Button>
          )}
          {landing.whatsapp_link && (
            <Button asChild className="bg-[#25D366] text-white hover:bg-[#20BA5A]">
              <a href={landing.whatsapp_link} target="_blank" rel="noopener noreferrer" onClick={() => onCta("whatsapp", landing.whatsapp_link)}>
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchLanding;
