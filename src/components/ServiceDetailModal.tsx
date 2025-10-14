import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, Phone, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Service } from "@/services/api";

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onBookAppointment: (service: Service) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ 
  open, 
  onClose, 
  service, 
  onBookAppointment 
}) => {
  const { t } = useTranslation();

  if (!service) return null;

  const handleBookAppointment = () => {
    onBookAppointment(service);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-heading font-bold text-foreground">
            {service.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Price Range</div>
              <div className="text-3xl font-bold text-primary">
                {service.price_range_display}
              </div>
              {service.min_price !== service.max_price && (
                <div className="text-xs text-muted-foreground mt-1">
                  Varies by branch location
                </div>
              )}
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                {service.duration_minutes} min
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">What's Included:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Comprehensive health assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Medical history review</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Physical examination</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Diagnosis and treatment plan</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Prescription if needed</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Follow-up recommendations</span>
              </div>
            </div>
          </div>

          {/* Available Branches */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Available at {service.branches_offering_service.length} Branch{service.branches_offering_service.length !== 1 ? 'es' : ''}
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {service.branches_offering_service.map((branch) => (
                <Card key={branch.id} className="p-4 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{branch.name}</h4>
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary">
                        RM {branch.price}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{branch.operating_hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button 
            onClick={handleBookAppointment} 
            size="lg" 
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
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
