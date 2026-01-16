import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MapPin, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Service } from "@/services/api";

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  isLoading?: boolean;
  onBookAppointment: (service: Service) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ 
  open, 
  onClose, 
  service, 
  isLoading,
  onBookAppointment 
}) => {
  const { t } = useTranslation();

  if (!service) return null;

  const handleBookAppointment = () => {
    onBookAppointment(service);
    onClose();
  };

  const descriptionText = (service.full_description || service.short_description || "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-3xl font-heading font-bold text-foreground">
            {service.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2 whitespace-pre-line">
            {descriptionText}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Price */}
          <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Price Range</div>
            <div className="text-3xl font-bold text-primary">
              {service.show_price && service.price_range ? service.price_range : t("services.contactForPrice")}
            </div>
          </div>

          {/* What's Included */}
          {service.tags && service.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">What's Included:</h3>
              <div className="space-y-2">
                {service.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Branches */}
          {service.branches && service.branches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Available at {service.branches.length} Branch{service.branches.length !== 1 ? "es" : ""}
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {service.branches.map((branch) => (
                  <Card key={branch.id} className="p-4 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{branch.name}</h4>
                          <p className="text-sm text-muted-foreground">{branch.address}</p>
                        </div>
                        {branch.accepts_online_booking && (
                          <Badge variant="outline" className="text-primary border-primary">
                            Online Booking
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleBookAppointment}
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "Book Appointment"}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="lg"
            className="px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
