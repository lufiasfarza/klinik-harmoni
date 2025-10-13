import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Download,
  Share2,
  QrCode,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookingConfirmationProps {
  bookingData: {
    id: string;
    branch: string;
    service: string;
    date: Date;
    time: string;
    doctor?: string;
    patientName: string;
    phone: string;
    email: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
  onClose: () => void;
}

const BookingConfirmation = ({ bookingData, onClose }: BookingConfirmationProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");

  useEffect(() => {
    // Generate QR Code URL (mock)
    const bookingUrl = `${window.location.origin}/booking/${bookingData.id}`;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`);
    
    // Generate WhatsApp message
    const message = `Hi! I've booked an appointment at Elite Wellness:
    
📅 Date: ${format(bookingData.date, "PPP")}
⏰ Time: ${bookingData.time}
📍 Branch: ${bookingData.branch}
🩺 Service: ${bookingData.service}
👨‍⚕️ Doctor: ${bookingData.doctor || 'Any Available'}

Booking ID: ${bookingData.id}`;
    
    setWhatsappMessage(encodeURIComponent(message));
  }, [bookingData]);

  const handleDownloadTicket = () => {
    // Create a printable ticket
    const ticketContent = `
ELITE WELLNESS - APPOINTMENT CONFIRMATION

Booking ID: ${bookingData.id}
Date: ${format(bookingData.date, "PPP")}
Time: ${bookingData.time}
Branch: ${bookingData.branch}
Service: ${bookingData.service}
Doctor: ${bookingData.doctor || 'Any Available'}

Patient Details:
Name: ${bookingData.patientName}
Phone: ${bookingData.phone}
Email: ${bookingData.email}

Status: ${bookingData.status.toUpperCase()}

Please arrive 15 minutes before your appointment time.
Bring this confirmation and a valid ID.

For any changes, please contact us at +60 3-1234 5678
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elite-wellness-booking-${bookingData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Ticket downloaded successfully!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Elite Wellness Appointment',
          text: `I've booked an appointment at Elite Wellness for ${format(bookingData.date, "PPP")} at ${bookingData.time}`,
          url: `${window.location.origin}/booking/${bookingData.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Elite Wellness Appointment - ${format(bookingData.date, "PPP")} at ${bookingData.time}`;
      await navigator.clipboard.writeText(shareText);
      toast.success("Appointment details copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/60123456789?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked
          </p>
        </div>
        <Badge className={`${getStatusColor(bookingData.status)} text-white`}>
          {bookingData.status.toUpperCase()}
        </Badge>
      </div>

      {/* Booking Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{format(bookingData.date, "PPP")}</p>
                <p className="text-sm text-muted-foreground">Appointment Date</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{bookingData.time}</p>
                <p className="text-sm text-muted-foreground">Time Slot</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{bookingData.branch}</p>
                <p className="text-sm text-muted-foreground">Branch Location</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{bookingData.service}</p>
                <p className="text-sm text-muted-foreground">Service Type</p>
              </div>
            </div>
            
            {bookingData.doctor && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{bookingData.doctor}</p>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{bookingData.phone}</p>
                <p className="text-sm text-muted-foreground">Contact Number</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Important Reminders:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Please arrive 15 minutes before your appointment time</li>
            <li>• Bring a valid ID and this confirmation</li>
            <li>• If you need to reschedule, please call us at least 24 hours in advance</li>
            <li>• You will receive a reminder SMS 24 hours before your appointment</li>
          </ul>
        </div>
      </Card>

      {/* QR Code */}
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Digital Ticket</h3>
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg border-2 border-dashed border-muted-foreground/25">
            <img 
              src={qrCodeUrl} 
              alt="Booking QR Code" 
              className="w-32 h-32"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Show this QR code at the clinic for quick check-in
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          onClick={handleDownloadTicket}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button 
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          Done
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
