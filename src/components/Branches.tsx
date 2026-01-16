import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Search, Navigation, Map, Loader2 } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiService, Branch as ApiBranch, getStorageUrl } from "@/services/api";
import { toast } from "sonner";

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

interface Branch extends ApiBranch {
  // Extended fields for UI
  city?: string;
  state?: string;
  whatsapp?: string;
  hours?: {
    weekday: string;
    weekend: string;
  };
  mapUrl?: string;
  wazeUrl?: string;
  clinicPhoto?: string;
}

const Branches = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        console.log('Fetching branches from API...');
        const response = await apiService.getBranches();
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          // Transform API data to include UI-specific fields
          const transformedBranches: Branch[] = response.data.map((apiBranch, index) => {
            // Map clinic photos based on branch name
            const clinicPhotos = [
              clinicKLCentral, clinicPJ, clinicBangsar, 
              clinicMontKiara, clinicSubang, clinicDamansara,
              clinicShahAlam, clinicJB, clinicPenang, 
              clinicIpoh, clinicMelaka, clinicKK, clinicKuching
            ];
            
            // Parse operating hours from object format
            const parseHours = (hours: ApiBranch["operating_hours"]) => {
              if (!hours || typeof hours !== 'object') {
                return { weekday: "24 Jam", weekend: "24 Jam" };
              }

              const parseDay = (day: unknown) => {
                if (!day) return null;
                if (typeof day === 'string') {
                  try {
                    return JSON.parse(day) as { is_open: boolean; open: string; close: string };
                  } catch {
                    return null;
                  }
                }
                if (typeof day === 'object') {
                  return day as { is_open: boolean; open: string; close: string };
                }
                return null;
              };

              const monday = parseDay(hours["monday"]);
              const saturday = parseDay(hours["saturday"]);

              const weekdayHours = monday?.is_open
                ? `${monday.open} - ${monday.close}`
                : "Tutup";
              const weekendHours = saturday?.is_open
                ? `${saturday.open} - ${saturday.close}`
                : "Tutup";

              return {
                weekday: `Mon-Fri: ${weekdayHours}`,
                weekend: `Sat-Sun: ${weekendHours}`
              };
            };

            return {
              ...apiBranch,
              city: apiBranch.name.split(' ').pop() || '',
              state: apiBranch.name.includes('KL') || apiBranch.name.includes('Bangsar') || apiBranch.name.includes('Mont Kiara') ? 'Kuala Lumpur' : 'Selangor',
              whatsapp: (apiBranch.contact_whatsapp || apiBranch.contact_phone || '').replace(/\D/g, ''),
              hours: parseHours(apiBranch.operating_hours),
              mapUrl: apiBranch.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(apiBranch.address || '')}`,
              wazeUrl: apiBranch.waze_url || `https://waze.com/ul?q=${encodeURIComponent(apiBranch.address || '')}`,
              clinicPhoto: getStorageUrl(apiBranch.featured_image) || clinicPhotos[index % clinicPhotos.length]
            };
          });
          
          console.log('Transformed branches:', transformedBranches);
          setBranches(transformedBranches);
        } else {
          console.error('API Error:', response);
          setError('Failed to load branches');
          toast.error('Failed to load branches data');
        }
      } catch (err) {
        console.error('Network Error:', err);
        setError('Network error');
        toast.error('Network error while loading branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Get unique values for filters
  const states = ["all", ...Array.from(new Set(branches.map(b => b.state).filter(Boolean)))];
  const cities = ["all", ...Array.from(new Set(branches.map(b => b.city).filter(Boolean)))];

  const filteredBranches = branches.filter(branch => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      branch.name.toLowerCase().includes(query) ||
      (branch.city && branch.city.toLowerCase().includes(query)) ||
      (branch.state && branch.state.toLowerCase().includes(query)) ||
      branch.address.toLowerCase().includes(query);
    
    const matchesState = selectedState === "all" || branch.state === selectedState;
    const matchesCity = selectedCity === "all" || branch.city === selectedCity;
    
    return matchesSearch && matchesState && matchesCity;
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
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
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-center text-muted-foreground mb-8 animate-fade-in">
            Found {filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading branches...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Branches Grid */}
        {!loading && !error && (
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
                  {branch.whatsapp && (
                    <Button
                      onClick={() => handleWhatsApp(branch.whatsapp, branch.name)}
                      className="flex-1 min-w-[140px] bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 h-11 text-sm font-medium shadow-soft"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('branches.whatsapp')}
                    </Button>
                  )}

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
                {branch.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <a
                      href={`tel:${branch.contact_phone}`}
                      className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {branch.contact_phone}
                    </a>
                  </div>
                )}

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

                {/* Doctor info can be shown on branch detail pages */}
              </div>
            </Card>
          ))}
          </div>
        )}

        {/* No results message */}
        {!loading && !error && filteredBranches.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <MapPin className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              No branches found matching "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Try searching by location, city, or state
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Branches;
