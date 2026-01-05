import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  branch: string;
  service: string;
  date: Date;
  time: string;
  doctor?: string;
  patientName: string;
  phone: string;
  email: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: Date;
}

interface BookingHistoryProps {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (booking: Booking) => void;
}

const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
] as const;

type FilterKey = (typeof filterOptions)[number]['key'];

const BookingHistory = ({ bookings, onEdit, onCancel, onReschedule }: BookingHistoryProps) => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

  const filteredBookings = bookings
    .filter(booking => {
      const now = new Date();
      const bookingDateTime = new Date(`${booking.date.toISOString().split('T')[0]} ${booking.time}`);
      
      switch (filter) {
        case 'upcoming':
          return isAfter(bookingDateTime, now) && booking.status !== 'cancelled';
        case 'past':
          return isBefore(bookingDateTime, now) && booking.status !== 'cancelled';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(`${b.date.toISOString().split('T')[0]} ${b.time}`).getTime() - 
               new Date(`${a.date.toISOString().split('T')[0]} ${a.time}`).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const canReschedule = (booking: Booking) => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.date.toISOString().split('T')[0]} ${booking.time}`);
    const hoursUntilAppointment = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.status === 'confirmed' && hoursUntilAppointment > 24;
  };

  const canCancel = (booking: Booking) => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.date.toISOString().split('T')[0]} ${booking.time}`);
    const hoursUntilAppointment = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.status === 'confirmed' && hoursUntilAppointment > 2;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {filterOptions.map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            By Date
          </Button>
          <Button
            variant={sortBy === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('status')}
          >
            By Status
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : `No ${filter} bookings found.`
              }
            </p>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{format(booking.date, "PPP")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{booking.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{booking.branch}</span>
                    </div>
                    
                    {booking.doctor && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-primary" />
                        <span>{booking.doctor}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  {canReschedule(booking) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onReschedule?.(booking)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Reschedule
                    </Button>
                  )}
                  
                  {canCancel(booking) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onCancel?.(booking.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
