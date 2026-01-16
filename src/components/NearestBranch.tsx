import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, Phone, Clock, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Branch } from "@/services/api";
import { useTranslation } from "react-i18next";

type Location = { lat: number; lng: number };

type BranchWithDistance = Branch & { distanceKm?: number };

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceKm = (from: Location, to: Location) => {
  const radius = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
};

const NearestBranch = () => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      const response = await apiService.getBranches();
      if (response.success && response.data) {
        setBranches(response.data);
      }
    };

    loadBranches();
  }, []);

  const branchesWithDistance = useMemo(() => {
    if (!userLocation) return branches as BranchWithDistance[];

    return branches.map((branch) => {
      if (branch.latitude && branch.longitude) {
        const distanceKm = getDistanceKm(userLocation, {
          lat: branch.latitude,
          lng: branch.longitude,
        });
        return { ...branch, distanceKm };
      }
      return branch;
    });
  }, [branches, userLocation]);

  const sortedBranches = useMemo(() => {
    return [...branchesWithDistance].sort((a, b) => {
      if (a.distanceKm === undefined) return 1;
      if (b.distanceKm === undefined) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [branchesWithDistance]);

  const featuredBranch = sortedBranches[0];
  const featuredPhone = featuredBranch?.contact_phone
    ? featuredBranch.contact_phone.replace(/\\D/g, "")
    : "";
  const featuredWhatsapp = featuredBranch?.contact_whatsapp
    ? featuredBranch.contact_whatsapp.replace(/\\D/g, "")
    : "";
  const listBranches = sortedBranches.slice(0, 3);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationError(t("nearest.locationUnsupported"));
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError(t("nearest.locationDenied"));
        setLocating(false);
      }
    );
  };

  const formatDistance = (distance?: number) => {
    if (distance === undefined) return null;
    return t("nearest.distance", { distance: distance.toFixed(1) });
  };

  const getDirectionsUrl = (branch?: Branch) => {
    if (!branch) return "#";
    if (branch.google_maps_url) return branch.google_maps_url;
    return `https://maps.google.com/?q=${encodeURIComponent(branch.address || branch.name)}`;
  };

  return (
    <section id="nearest" className="relative py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">{t("nearest.kicker")}</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {t("nearest.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                {t("nearest.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Button onClick={handleLocate} disabled={locating} className="shadow-elevated">
                <Navigation className="h-4 w-4 mr-2" />
                {locating ? t("nearest.locating") : t("nearest.useLocation")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("nearest.privacy")}
              </span>
            </div>

            {locationError && (
              <div className="text-sm text-destructive mb-6">{locationError}</div>
            )}

            <div className="space-y-4">
              {listBranches.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("nearest.noBranches")}</p>
              )}
              {listBranches.map((branch, index) => (
                <Card key={branch.id} className="p-5 border-0 shadow-soft bg-background/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{branch.name}</h3>
                        {index === 0 && userLocation && (
                          <Badge className="bg-primary/10 text-primary">{t("nearest.closest")}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{branch.address}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {branch.today_hours || t("nearest.hoursUnavailable")}
                        </span>
                        {branch.is_currently_open !== undefined && (
                          <Badge variant="outline" className={branch.is_currently_open ? "text-emerald-600 border-emerald-200" : "text-rose-600 border-rose-200"}>
                            {branch.is_currently_open ? t("nearest.openNow") : t("nearest.closed")}
                          </Badge>
                        )}
                        {formatDistance(branch.distanceKm) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {formatDistance(branch.distanceKm)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => window.open(getDirectionsUrl(branch), "_blank")}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      {t("nearest.directions")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-0 shadow-elevated bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.25),_transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(20,184,166,0.1),_transparent_60%)]" />
            <div className="relative p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("nearest.highlight")}</p>
                  <h3 className="text-xl font-semibold text-foreground">
                    {featuredBranch?.name || t("nearest.awaiting")}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {featuredBranch?.address || t("nearest.awaitingDescription")}
              </p>

              {featuredBranch && (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    className="w-full"
                    onClick={() => window.open(getDirectionsUrl(featuredBranch), "_blank")}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {t("nearest.directions")}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      disabled={!featuredPhone}
                      onClick={() => window.location.assign(`tel:${featuredPhone}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {t("nearest.call")}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!featuredWhatsapp}
                      onClick={() =>
                        window.open(
                          `https://wa.me/${featuredWhatsapp}`,
                          "_blank"
                        )
                      }
                    >
                      {t("nearest.whatsapp")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NearestBranch;
