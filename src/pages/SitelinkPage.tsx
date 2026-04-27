import { Mail, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicHead from "@/components/DynamicHead";
import Branches from "@/components/Branches";
import Booking from "@/components/Booking";
import Services from "@/components/Services";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClinic } from "@/contexts/ClinicContext";

type SitelinkPageType = "branches" | "booking" | "services" | "contact";

interface SitelinkPageProps {
  type: SitelinkPageType;
}

const pageMeta: Record<SitelinkPageType, { title: string; description: string }> = {
  branches: {
    title: "Cawangan Klinik Harmoni",
    description: "Cari cawangan Klinik Harmoni berhampiran anda serta lihat alamat, telefon, WhatsApp dan Google Maps.",
  },
  booking: {
    title: "Temujanji Klinik Harmoni",
    description: "Tempah slot rawatan di cawangan Klinik Harmoni pilihan anda secara online.",
  },
  services: {
    title: "Rawatan Klinik Harmoni",
    description: "Lihat rawatan dan perkhidmatan kesihatan yang ditawarkan di Klinik Harmoni.",
  },
  contact: {
    title: "Hubungi Klinik Harmoni",
    description: "Hubungi Klinik Harmoni melalui telefon, WhatsApp atau cari cawangan berhampiran anda.",
  },
};

const Hero = ({ type }: { type: SitelinkPageType }) => {
  const meta = pageMeta[type];

  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">
            Klinik Harmoni
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-primary-foreground/90">
            {meta.description}
          </p>
        </div>
      </div>
    </section>
  );
};

const ContactPanel = () => {
  const { clinicInfo } = useClinic();
  const phone = clinicInfo?.contact?.phone || "+60321428888";
  const email = clinicInfo?.contact?.email || "info@klinikharmoni.my";
  const whatsapp = (clinicInfo?.contact?.whatsapp || phone).replace(/\D/g, "");

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 shadow-card">
            <Phone className="h-8 w-8 text-primary mb-4" />
            <h2 className="font-heading text-xl font-semibold">Telefon</h2>
            <p className="mt-2 text-muted-foreground">Hubungi kaunter untuk pertanyaan rawatan dan waktu operasi.</p>
            <Button asChild className="mt-5 w-full">
              <a href={`tel:${phone}`}>Call Klinik</a>
            </Button>
          </Card>

          <Card className="p-6 shadow-card">
            <MessageCircle className="h-8 w-8 text-primary mb-4" />
            <h2 className="font-heading text-xl font-semibold">WhatsApp</h2>
            <p className="mt-2 text-muted-foreground">Tanya cawangan terdekat, rawatan tersedia dan anggaran giliran.</p>
            <Button asChild className="mt-5 w-full bg-[#25D366] text-white hover:bg-[#20BA5A]">
              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Klinik Harmoni, saya nak tanya rawatan.")}`} target="_blank" rel="noopener noreferrer">
                WhatsApp Sekarang
              </a>
            </Button>
          </Card>

          <Card className="p-6 shadow-card">
            <Mail className="h-8 w-8 text-primary mb-4" />
            <h2 className="font-heading text-xl font-semibold">Email</h2>
            <p className="mt-2 text-muted-foreground">Untuk pertanyaan umum, panel atau maklumat korporat.</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <a href={`mailto:${email}`}>{email}</a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

const SitelinkPage = ({ type }: SitelinkPageProps) => {
  const meta = pageMeta[type];

  return (
    <div className="min-h-screen">
      <DynamicHead title={meta.title} description={meta.description} />
      <Navbar />
      <Hero type={type} />
      {type === "branches" && <Branches />}
      {type === "booking" && <Booking />}
      {type === "services" && <Services />}
      {type === "contact" && (
        <>
          <ContactPanel />
          <Branches />
        </>
      )}
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SitelinkPage;
