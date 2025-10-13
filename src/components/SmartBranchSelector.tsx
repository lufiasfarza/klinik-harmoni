import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Phone, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  distance?: number;
  image: string;
  services: string[];
  isOpen: boolean;
}

interface SmartBranchSelectorProps {
  onBranchSelect: (branchId: string) => void;
  selectedBranch?: string;
}

const SmartBranchSelector = ({ onBranchSelect, selectedBranch }: SmartBranchSelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'name'>('distance');

  const branches: Branch[] = [
    {
      id: "kl-central",
      name: "KL Central",
      address: "Level 2, KL Sentral, Kuala Lumpur",
      phone: "+60 3-2274 1000",
      operatingHours: "Mon-Fri: 8AM-8PM, Sat: 8AM-6PM",
      image: "/clinic-kl-central.jpg",
      services: ["General Consultation", "Physiotherapy", "Vaccination"],
      isOpen: true,
    },
    {
      id: "petaling-jaya",
      name: "Petaling Jaya",
      address: "SS2, Petaling Jaya, Selangor",
      phone: "+60 3-7956 2000",
      operatingHours: "Mon-Fri: 8AM-8PM, Sat: 8AM-6PM",
      image: "/clinic-pj.jpg",
      services: ["Physiotherapy", "Massage", "Health Check"],
      isOpen: true,
    },
    {
      id: "bangsar",
      name: "Bangsar",
      address: "Bangsar Shopping Centre, Kuala Lumpur",
      phone: "+60 3-2282 3000",
      operatingHours: "Mon-Fri: 9AM-7PM, Sat: 9AM-5PM",
      image: "/clinic-bangsar.jpg",
      services: ["General Consultation", "Physiotherapy"],
      isOpen: false,
    },
    // Add more branches...
  ];

  useEffect(() => {
    // Get user location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  const filteredBranches = branches
    .filter(branch => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'distance' && userLocation) {
        // Calculate distance (simplified)
        const distanceA = Math.random() * 20; // Mock distance
        const distanceB = Math.random() * 20;
        return distanceA - distanceB;
      }
      return a.name.localeCompare(b.name);
    });

  const getCurrentTimeStatus = (branch: Branch) => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day === 0) return false; // Sunday
    if (day === 6 && hour >= 8 && hour < 18) return true; // Saturday
    if (hour >= 8 && hour < 20) return true; // Weekdays
    
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location, services, or branch name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'distance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('distance')}
            className="flex-1"
          >
            <Navigation className="h-4 w-4 mr-1" />
            Nearest
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('name')}
            className="flex-1"
          >
            Alphabetical
          </Button>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredBranches.map((branch) => (
          <Card
            key={branch.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedBranch === branch.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onBranchSelect(branch.id)}
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{branch.name}</h3>
                  <div className="flex gap-1">
                    {getCurrentTimeStatus(branch) ? (
                      <Badge variant="default" className="bg-green-500">
                        Open Now
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Closed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{branch.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{branch.phone}</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {branch.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {branch.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{branch.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No branches found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SmartBranchSelector;
