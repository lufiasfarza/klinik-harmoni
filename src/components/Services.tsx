import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Baby, Syringe, ScanLine, Heart, Users, Scissors, UserPlus, TestTube2, Shield, FlaskConical, Stethoscope, Activity, Target, Scale, User } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: any;
  details: string[];
  duration?: string;
  category?: string;
}

const servicesData: Service[] = [
  {
    id: 1,
    title: "2D / 3D / 4D / 5D HD Ultrasound Package",
    description: "Advanced ultrasound imaging with high-definition clarity for detailed visualization.",
    price: "RM 200 - RM 500",
    icon: ScanLine,
    category: "packages",
    details: [
      "2D basic ultrasound imaging",
      "3D detailed visualization",
      "4D real-time imaging",
      "5D HD enhanced clarity",
      "Printed images included",
      "USB recording available"
    ]
  },
  {
    id: 2,
    title: "Antenatal Clinic",
    description: "Comprehensive prenatal care and monitoring throughout your pregnancy journey.",
    price: "RM 80 - RM 150",
    icon: Baby,
    category: "packages",
    details: [
      "Regular pregnancy check-ups",
      "Fetal development monitoring",
      "Maternal health assessment",
      "Nutritional counseling",
      "Birth planning guidance",
      "Prenatal screening tests"
    ]
  },
  {
    id: 3,
    title: "Vaccination Program",
    description: "Complete immunization services for all ages with certified vaccines.",
    price: "RM 50 - RM 300",
    icon: Syringe,
    category: "packages",
    details: [
      "Childhood vaccinations",
      "Adult immunizations",
      "Travel vaccines",
      "Flu shots",
      "HPV vaccination",
      "COVID-19 vaccines"
    ]
  },
  {
    id: 4,
    title: "X-Ray",
    description: "Digital X-ray imaging for accurate diagnosis and treatment planning.",
    price: "RM 60 - RM 150",
    icon: ScanLine,
    category: "packages",
    details: [
      "Digital radiography",
      "Chest X-rays",
      "Bone imaging",
      "Joint examination",
      "Immediate results",
      "Expert interpretation"
    ]
  },
  {
    id: 5,
    title: "Female Ultrasound Package",
    description: "Specialized ultrasound services for women's health screening and diagnosis.",
    price: "RM 150 - RM 350",
    icon: User,
    category: "packages",
    details: [
      "Pelvic ultrasound",
      "Ovarian assessment",
      "Uterine examination",
      "Breast ultrasound",
      "Fertility assessment",
      "Gynecological screening"
    ]
  },
  {
    id: 6,
    title: "Male Ultrasound Package",
    description: "Comprehensive ultrasound services for men's health diagnostics.",
    price: "RM 150 - RM 350",
    icon: User,
    category: "packages",
    details: [
      "Abdominal ultrasound",
      "Prostate examination",
      "Testicular ultrasound",
      "Kidney assessment",
      "Bladder screening",
      "Vascular imaging"
    ]
  },
  {
    id: 7,
    title: "Wellness Package",
    description: "Complete health screening package for overall wellness assessment.",
    price: "RM 300 - RM 800",
    icon: Heart,
    category: "packages",
    details: [
      "Full blood panel",
      "Cardiovascular screening",
      "Diabetes testing",
      "Cholesterol check",
      "Kidney function test",
      "Health consultation"
    ]
  },
  {
    id: 8,
    title: "Women Wellness Package",
    description: "Tailored health screening for women's specific health needs.",
    price: "RM 400 - RM 900",
    icon: Heart,
    category: "packages",
    details: [
      "Breast examination",
      "Pelvic ultrasound",
      "Pap smear test",
      "Hormonal assessment",
      "Bone density scan",
      "Nutritional counseling"
    ]
  },
  {
    id: 9,
    title: "Circumcision",
    description: "Safe and professional circumcision procedure with experienced specialists.",
    price: "RM 300 - RM 600",
    icon: Scissors,
    category: "packages",
    details: [
      "Pre-procedure consultation",
      "Sterile environment",
      "Pain management",
      "Post-operative care",
      "Follow-up appointments",
      "Wound care guidance"
    ]
  },
  {
    id: 10,
    title: "Family Planning",
    description: "Comprehensive family planning services and reproductive health counseling.",
    price: "RM 80 - RM 200",
    icon: Users,
    category: "packages",
    details: [
      "Contraceptive counseling",
      "IUD insertion",
      "Birth control options",
      "Preconception care",
      "Fertility consultation",
      "Couple counseling"
    ]
  },
  {
    id: 11,
    title: "As-Salam Mini Lab",
    description: "Quick diagnostic laboratory services with accurate results.",
    price: "RM 30 - RM 200",
    icon: TestTube2,
    category: "packages",
    details: [
      "Blood tests",
      "Urine analysis",
      "Rapid diagnostic tests",
      "Same-day results",
      "Certified laboratory",
      "Online report access"
    ]
  },
  {
    id: 12,
    title: "Cervical Cancer Prevention",
    description: "Screening and prevention programs for cervical cancer.",
    price: "RM 150 - RM 400",
    icon: Shield,
    category: "packages",
    details: [
      "Pap smear screening",
      "HPV testing",
      "Colposcopy",
      "HPV vaccination",
      "Risk assessment",
      "Follow-up care"
    ]
  },
  {
    id: 13,
    title: "Obstetrics & Gynaecology Clinic",
    description: "Expert care for women's reproductive health and pregnancy.",
    price: "RM 100 - RM 300",
    icon: Baby,
    category: "focus",
    details: [
      "Pregnancy care",
      "Delivery services",
      "Gynecological surgery",
      "Menstrual disorders",
      "Menopause management",
      "Reproductive health"
    ]
  },
  {
    id: 14,
    title: "Fertility Clinic",
    description: "Specialized fertility treatments and reproductive assistance.",
    price: "RM 200 - RM 1000",
    icon: FlaskConical,
    category: "focus",
    details: [
      "Fertility assessment",
      "Ovulation monitoring",
      "Hormonal treatment",
      "IUI procedures",
      "Pre-IVF counseling",
      "Fertility preservation"
    ]
  },
  {
    id: 15,
    title: "Occupational Health Clinic (OSH)",
    description: "Workplace health services and occupational safety programs.",
    price: "RM 80 - RM 250",
    icon: Stethoscope,
    category: "focus",
    details: [
      "Pre-employment screening",
      "Annual health checks",
      "Workplace injury treatment",
      "Health surveillance",
      "Vaccination for workers",
      "Fitness-to-work assessment"
    ]
  },
  {
    id: 16,
    title: "Chronic Disease Clinic",
    description: "Comprehensive management of chronic health conditions.",
    price: "RM 100 - RM 300",
    icon: Activity,
    category: "focus",
    details: [
      "Diabetes management",
      "Hypertension control",
      "Heart disease care",
      "Asthma treatment",
      "Medication management",
      "Lifestyle counseling"
    ]
  },
  {
    id: 17,
    title: "Pain Clinic",
    description: "Specialized pain management and relief treatments.",
    price: "RM 150 - RM 400",
    icon: Target,
    category: "focus",
    details: [
      "Chronic pain assessment",
      "Pain medication management",
      "Injection therapy",
      "Physical rehabilitation",
      "Nerve block procedures",
      "Pain counseling"
    ]
  },
  {
    id: 18,
    title: "Weight Management Clinic",
    description: "Personalized weight loss and nutrition programs.",
    price: "RM 200 - RM 600",
    icon: Scale,
    category: "focus",
    details: [
      "Body composition analysis",
      "Customized diet plans",
      "Exercise programs",
      "Metabolic assessment",
      "Nutritional counseling",
      "Regular monitoring"
    ]
  },
  {
    id: 19,
    title: "Women Clinic",
    description: "Dedicated healthcare services addressing women's health needs.",
    price: "RM 100 - RM 300",
    icon: User,
    category: "focus",
    details: [
      "General women's health",
      "Preventive screenings",
      "Hormonal consultations",
      "Breast examinations",
      "Sexual health",
      "Wellness programs"
    ]
  },
  {
    id: 20,
    title: "Paediatric Clinic",
    description: "Comprehensive healthcare for infants, children, and adolescents.",
    price: "RM 80 - RM 200",
    icon: UserPlus,
    category: "focus",
    details: [
      "Child development monitoring",
      "Vaccination schedules",
      "Common illness treatment",
      "Growth assessment",
      "Nutritional guidance",
      "Parental counseling"
    ]
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const packages = servicesData.filter(s => s.category === "packages");
  const focusClinic = servicesData.filter(s => s.category === "focus");

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our Services & Packages
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive healthcare solutions tailored to your wellness journey
          </p>
        </div>

        {/* Packages Section */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {packages.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className="hover-lift cursor-pointer group border-0 shadow-card bg-card"
                  onClick={() => setSelectedService(service)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#E53935] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Focus Clinic Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Focus Clinic
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {focusClinic.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className="hover-lift cursor-pointer group border-0 shadow-card bg-card"
                  onClick={() => setSelectedService(service)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#E53935] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
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
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-20 h-20 rounded-full bg-[#E53935] flex items-center justify-center flex-shrink-0">
                  {selectedService.icon && <selectedService.icon className="w-10 h-10 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Price Range</div>
                  <div className="text-2xl font-semibold text-primary">{selectedService.price}</div>
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
