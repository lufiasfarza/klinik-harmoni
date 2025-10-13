import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Search, Navigation, Map } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import clinic photos
import clinicKLCentral from "@/assets/clinic-kl-central.jpg";
import clinicPJ from "@/assets/clinic-pj.jpg";
import clinicBangsar from "@/assets/clinic-bangsar.jpg";
import clinicMontKiara from "@/assets/clinic-montkiara.jpg";
import clinicSubang from "@/assets/clinic-subang.jpg";
import clinicDamansara from "@/assets/clinic-damansara.jpg";
import clinicShahAlam from "@/assets/clinic-shahalam.jpg";
import clinicJB from "@/assets/clinic-jb.jpg";
import clinicPenang from "@/assets/clinic-penang.jpg";
import clinicIpoh from "@/assets/clinic-ipoh.jpg";
import clinicMelaka from "@/assets/clinic-melaka.jpg";
import clinicKK from "@/assets/clinic-kk.jpg";
import clinicKuching from "@/assets/clinic-kuching.jpg";

// Import doctor photos
import doctorSarah from "@/assets/doctor-sarah.jpg";
import doctorAhmad from "@/assets/doctor-ahmad.jpg";
import doctorMei from "@/assets/doctor-mei.jpg";
import doctorRaj from "@/assets/doctor-raj.jpg";
import doctorLisa from "@/assets/doctor-lisa.jpg";
import doctorDaniel from "@/assets/doctor-daniel.jpg";
import doctorAminah from "@/assets/doctor-aminah.jpg";
import doctorWong from "@/assets/doctor-wong.jpg";
import doctorPriya from "@/assets/doctor-priya.jpg";
import doctorFarid from "@/assets/doctor-farid.jpg";
import doctorCatherine from "@/assets/doctor-catherine.jpg";
import doctorMarcus from "@/assets/doctor-marcus.jpg";

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  mapUrl: string;
  wazeUrl: string;
  doctor: {
    name: string;
    photo: string;
  };
  clinicPhoto: string;
}

const branchesData: Branch[] = [
  {
    id: 1,
    name: "Elite Wellness KL Central",
    address: "Level 5, Pavilion KL, 168 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    phone: "+603-2142 8888",
    whatsapp: "+60321428888",
    hours: {
      weekday: "Mon-Sat: 9:00 AM - 8:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Pavilion+KL",
    wazeUrl: "https://waze.com/ul?q=Pavilion+KL",
    doctor: {
      name: "Dr. Sarah Lim",
      photo: doctorSarah
    },
    clinicPhoto: clinicKLCentral
  },
  {
    id: 2,
    name: "Elite Wellness Petaling Jaya",
    address: "G-03, Jaya One, 72A Jalan Universiti, 46200 Petaling Jaya, Selangor",
    city: "Petaling Jaya",
    state: "Selangor",
    phone: "+603-7932 5555",
    whatsapp: "+60379325555",
    hours: {
      weekday: "Mon-Sat: 9:00 AM - 8:00 PM",
      weekend: "Sun: Closed"
    },
    mapUrl: "https://maps.google.com/?q=Jaya+One+PJ",
    wazeUrl: "https://waze.com/ul?q=Jaya+One+PJ",
    doctor: {
      name: "Dr. Ahmad Razak",
      photo: doctorAhmad
    },
    clinicPhoto: clinicPJ
  },
  {
    id: 3,
    name: "Elite Wellness Bangsar",
    address: "Unit 10-1, Bangsar Village II, 2 Jalan Telawi 1, 59100 Bangsar, KL",
    city: "Bangsar",
    state: "Kuala Lumpur",
    phone: "+603-2282 3333",
    whatsapp: "+60322823333",
    hours: {
      weekday: "Mon-Fri: 10:00 AM - 7:00 PM",
      weekend: "Sat-Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Bangsar+Village+II",
    wazeUrl: "https://waze.com/ul?q=Bangsar+Village+II",
    doctor: {
      name: "Dr. Mei Chen",
      photo: doctorMei
    },
    clinicPhoto: clinicBangsar
  },
  {
    id: 4,
    name: "Elite Wellness Mont Kiara",
    address: "163 Retail Park, 2 Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur",
    city: "Mont Kiara",
    state: "Kuala Lumpur",
    phone: "+603-6211 7777",
    whatsapp: "+60362117777",
    hours: {
      weekday: "Mon-Sat: 9:00 AM - 9:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=163+Retail+Park+Mont+Kiara",
    wazeUrl: "https://waze.com/ul?q=163+Retail+Park+Mont+Kiara",
    doctor: {
      name: "Dr. Raj Kumar",
      photo: doctorRaj
    },
    clinicPhoto: clinicMontKiara
  },
  {
    id: 5,
    name: "Elite Wellness Subang Jaya",
    address: "LG-15 Empire Shopping Gallery, Jalan SS 16/1, 47500 Subang Jaya",
    city: "Subang Jaya",
    state: "Selangor",
    phone: "+603-5637 4444",
    whatsapp: "+60356374444",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 9:00 PM",
      weekend: "Sun: 10:00 AM - 7:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Empire+Shopping+Gallery",
    wazeUrl: "https://waze.com/ul?q=Empire+Shopping+Gallery",
    doctor: {
      name: "Dr. Lisa Tan",
      photo: doctorLisa
    },
    clinicPhoto: clinicSubang
  },
  {
    id: 6,
    name: "Elite Wellness Damansara",
    address: "A-G-5, Menara UOA Bangsar, 5 Jalan Bangsar Utama 1, 59000 KL",
    city: "Damansara",
    state: "Kuala Lumpur",
    phone: "+603-2287 1111",
    whatsapp: "+60322871111",
    hours: {
      weekday: "Mon-Fri: 9:00 AM - 7:00 PM",
      weekend: "Sat: 9:00 AM - 5:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Menara+UOA+Bangsar",
    wazeUrl: "https://waze.com/ul?q=Menara+UOA+Bangsar",
    doctor: {
      name: "Dr. Daniel Ng",
      photo: doctorDaniel
    },
    clinicPhoto: clinicDamansara
  },
  {
    id: 7,
    name: "Elite Wellness Shah Alam",
    address: "F-G-01, Plaza Alam Sentral, Jalan Majlis, 40000 Shah Alam, Selangor",
    city: "Shah Alam",
    state: "Selangor",
    phone: "+603-5510 2222",
    whatsapp: "+60355102222",
    hours: {
      weekday: "Mon-Sat: 9:00 AM - 8:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Plaza+Alam+Sentral+Shah+Alam",
    wazeUrl: "https://waze.com/ul?q=Plaza+Alam+Sentral+Shah+Alam",
    doctor: {
      name: "Dr. Aminah Hassan",
      photo: doctorAminah
    },
    clinicPhoto: clinicShahAlam
  },
  {
    id: 8,
    name: "Elite Wellness Johor Bahru",
    address: "L2-23, Paradigm Mall Johor Bahru, Jalan Skudai, 80200 Johor Bahru",
    city: "Johor Bahru",
    state: "Johor",
    phone: "+607-361 9999",
    whatsapp: "+60736199999",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 9:00 PM",
      weekend: "Sun: 10:00 AM - 7:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Paradigm+Mall+Johor+Bahru",
    wazeUrl: "https://waze.com/ul?q=Paradigm+Mall+Johor+Bahru",
    doctor: {
      name: "Dr. Wong Wei Jian",
      photo: doctorWong
    },
    clinicPhoto: clinicJB
  },
  {
    id: 9,
    name: "Elite Wellness Penang",
    address: "3F-08, Gurney Paragon Mall, Persiaran Gurney, 10250 George Town, Penang",
    city: "George Town",
    state: "Penang",
    phone: "+604-227 6666",
    whatsapp: "+60422276666",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 8:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Gurney+Paragon+Mall+Penang",
    wazeUrl: "https://waze.com/ul?q=Gurney+Paragon+Mall+Penang",
    doctor: {
      name: "Dr. Priya Nair",
      photo: doctorPriya
    },
    clinicPhoto: clinicPenang
  },
  {
    id: 10,
    name: "Elite Wellness Ipoh",
    address: "G-12, AEON Mall Kinta City, Jalan Sultan Azlan Shah, 31400 Ipoh, Perak",
    city: "Ipoh",
    state: "Perak",
    phone: "+605-312 5555",
    whatsapp: "+60531255555",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 9:00 PM",
      weekend: "Sun: 10:00 AM - 7:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=AEON+Mall+Kinta+City+Ipoh",
    wazeUrl: "https://waze.com/ul?q=AEON+Mall+Kinta+City+Ipoh",
    doctor: {
      name: "Dr. Farid Abdullah",
      photo: doctorFarid
    },
    clinicPhoto: clinicIpoh
  },
  {
    id: 11,
    name: "Elite Wellness Melaka",
    address: "L2-56, Hatten Square, Jalan Merdeka, 75000 Melaka",
    city: "Melaka",
    state: "Melaka",
    phone: "+606-282 8888",
    whatsapp: "+60628288888",
    hours: {
      weekday: "Mon-Sat: 9:00 AM - 8:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Hatten+Square+Melaka",
    wazeUrl: "https://waze.com/ul?q=Hatten+Square+Melaka",
    doctor: {
      name: "Dr. Catherine Lee",
      photo: doctorCatherine
    },
    clinicPhoto: clinicMelaka
  },
  {
    id: 12,
    name: "Elite Wellness Kota Kinabalu",
    address: "2F-18, Suria Sabah Shopping Mall, 1 Jalan Tun Fuad Stephens, 88000 KK",
    city: "Kota Kinabalu",
    state: "Sabah",
    phone: "+6088-235 7777",
    whatsapp: "+60882357777",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 8:00 PM",
      weekend: "Sun: 10:00 AM - 6:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Suria+Sabah+Shopping+Mall",
    wazeUrl: "https://waze.com/ul?q=Suria+Sabah+Shopping+Mall",
    doctor: {
      name: "Dr. Marcus Tan",
      photo: doctorMarcus
    },
    clinicPhoto: clinicKK
  },
  {
    id: 13,
    name: "Elite Wellness Kuching",
    address: "G-23, Vivacity Megamall, Jalan Wan Alwi, 93350 Kuching, Sarawak",
    city: "Kuching",
    state: "Sarawak",
    phone: "+6082-414 3333",
    whatsapp: "+60824143333",
    hours: {
      weekday: "Mon-Sat: 10:00 AM - 9:00 PM",
      weekend: "Sun: 10:00 AM - 7:00 PM"
    },
    mapUrl: "https://maps.google.com/?q=Vivacity+Megamall+Kuching",
    wazeUrl: "https://waze.com/ul?q=Vivacity+Megamall+Kuching",
    doctor: {
      name: "Dr. Sarah Lim",
      photo: doctorSarah
    },
    clinicPhoto: clinicKuching
  }
];

const Branches = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("all");

  // Get unique values for filters
  const states = ["all", ...Array.from(new Set(branchesData.map(b => b.state)))];
  const cities = ["all", ...Array.from(new Set(branchesData.map(b => b.city)))];
  const doctors = ["all", ...Array.from(new Set(branchesData.map(b => b.doctor.name)))];

  const filteredBranches = branchesData.filter(branch => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      branch.name.toLowerCase().includes(query) ||
      branch.city.toLowerCase().includes(query) ||
      branch.state.toLowerCase().includes(query) ||
      branch.doctor.name.toLowerCase().includes(query) ||
      branch.address.toLowerCase().includes(query);
    
    const matchesState = selectedState === "all" || branch.state === selectedState;
    const matchesCity = selectedCity === "all" || branch.city === selectedCity;
    const matchesDoctor = selectedDoctor === "all" || branch.doctor.name === selectedDoctor;
    
    return matchesSearch && matchesState && matchesCity && matchesDoctor;
  });

  const handleWhatsApp = (whatsapp: string, branchName: string) => {
    const message = encodeURIComponent(`Hello! I'd like to inquire about ${branchName}.`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <section id="branches" className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t('branches.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('branches.description')}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('branches.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-primary/20 focus:border-primary rounded-xl shadow-soft"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {states.map(state => (
                  <SelectItem key={state} value={state}>
                    {state === "all" ? "All States" : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city === "all" ? "All Cities" : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Filter by Doctor" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {doctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor === "all" ? "All Doctors" : doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-center text-muted-foreground mb-8 animate-fade-in">
            Found {filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'}
          </p>
        )}

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map((branch, index) => (
            <Card 
              key={branch.id}
              className="overflow-hidden hover-lift border-0 shadow-card bg-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Clinic Photo */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={branch.clinicPhoto} 
                  alt={branch.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6 space-y-5">
                {/* Branch Name */}
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  {branch.name}
                </h3>

                {/* Address */}
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {branch.address}
                  </p>
                </div>

                {/* Contact & Navigation Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* WhatsApp Button */}
                  <Button
                    onClick={() => handleWhatsApp(branch.whatsapp, branch.name)}
                    className="flex-1 min-w-[140px] bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 h-11 text-sm font-medium shadow-soft"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('branches.whatsapp')}
                  </Button>

                  {/* Maps Button */}
                  <Button
                    variant="outline"
                    onClick={() => window.open(branch.mapUrl, '_blank')}
                    className="flex-1 min-w-[70px] h-11 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {t('branches.maps')}
                  </Button>

                  {/* Waze Button */}
                  <Button
                    variant="outline"
                    onClick={() => window.open(branch.wazeUrl, '_blank')}
                    className="flex-1 min-w-[70px] h-11 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {t('branches.waze')}
                  </Button>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a 
                    href={`tel:${branch.phone}`} 
                    className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {branch.phone}
                  </a>
                </div>

                {/* Operating Hours */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-semibold text-foreground">{t('branches.operatingHours')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                      {branch.hours.weekday}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30">
                      {branch.hours.weekend}
                    </Badge>
                  </div>
                </div>

                {/* Doctor Profile */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    {t('branches.residentDoctor').toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={branch.doctor.photo} 
                        alt={branch.doctor.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-card" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {branch.doctor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        General Practitioner
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredBranches.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <MapPin className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              No branches found matching "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Try searching by location, city, or doctor name
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Branches;
