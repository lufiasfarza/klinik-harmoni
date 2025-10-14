import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiService, Branch, Doctor, Service, TimeSlot, AvailabilityData } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

interface AvailabilityCheckerProps {
  selectedBranch?: Branch;
  selectedDoctor?: Doctor;
  selectedService?: Service;
  onTimeSlotSelect?: (timeSlot: TimeSlot) => void;
  onAvailabilityChange?: (availability: AvailabilityData) => void;
}

const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({
  selectedBranch,
  selectedDoctor,
  selectedService,
  onTimeSlotSelect,
  onAvailabilityChange
}) => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<number>(selectedBranch?.id || 0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(selectedDoctor?.id || 0);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(selectedService?.id || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      setSelectedBranchId(selectedBranch.id);
      loadBranchData(selectedBranch.id);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedDoctor) {
      setSelectedDoctorId(selectedDoctor.id);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedService) {
      setSelectedServiceId(selectedService.id);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedBranchId && selectedDate) {
      checkAvailability();
    }
  }, [selectedBranchId, selectedDate, selectedServiceId, selectedDoctorId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [branchesResponse, servicesResponse] = await Promise.all([
        apiService.getBranches(),
        apiService.getServices()
      ]);

      if (branchesResponse.success && branchesResponse.data) {
        setBranches(branchesResponse.data);
      }

      if (servicesResponse.success && servicesResponse.data) {
        setServices(servicesResponse.data);
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBranchData = async (branchId: number) => {
    try {
      const [doctorsResponse, servicesResponse] = await Promise.all([
        apiService.getBranchDoctors(branchId),
        apiService.getBranchServices(branchId)
      ]);

      if (doctorsResponse.success && doctorsResponse.data) {
        setDoctors(doctorsResponse.data);
      }

      if (servicesResponse.success && servicesResponse.data) {
        setServices(servicesResponse.data);
      }
    } catch (err) {
      console.error('Failed to load branch data:', err);
    }
  };

  const checkAvailability = async () => {
    if (!selectedBranchId || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getBranchAvailability(
        selectedBranchId,
        selectedDate,
        selectedServiceId || undefined
      );

      if (response.success && response.data) {
        let availabilityData = response.data;

        // Filter by doctor if selected
        if (selectedDoctorId && availabilityData.time_slots) {
          availabilityData = {
            ...availabilityData,
            time_slots: availabilityData.time_slots.filter(slot => 
              slot.doctor?.id === selectedDoctorId
            )
          };
        }

        setAvailability(availabilityData);
        onAvailabilityChange?.(availabilityData);
      } else {
        setAvailability(null);
        setError(response.message || 'Failed to check availability');
      }
    } catch (err) {
      setAvailability(null);
      setError('Network error occurred');
      console.error('Failed to check availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId: number) => {
    setSelectedBranchId(branchId);
    setSelectedDoctorId(0); // Reset doctor selection
    loadBranchData(branchId);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    onTimeSlotSelect?.(timeSlot);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = () => {
    if (!availability) return null;

    if (!availability.is_open) {
      return {
        status: 'closed',
        message: t('availability.closed'),
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    const availableSlots = availability.time_slots?.filter(slot => slot.available) || [];
    
    if (availableSlots.length === 0) {
      return {
        status: 'no-slots',
        message: t('availability.noSlotsAvailable'),
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }

    return {
      status: 'available',
      message: t('availability.slotsAvailable', { count: availableSlots.length }),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };

  const renderTimeSlots = () => {
    if (!availability?.time_slots) return null;

    const availableSlots = availability.time_slots.filter(slot => slot.available);
    const unavailableSlots = availability.time_slots.filter(slot => !slot.available);

    return (
      <div className="space-y-4">
        {/* Available Slots */}
        {availableSlots.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('availability.availableSlots')} ({availableSlots.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant="outline"
                  className="h-12 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-300"
                  onClick={() => handleTimeSlotClick(slot)}
                >
                  <span className="font-medium">{slot.time}</span>
                  {slot.doctor && (
                    <span className="text-xs text-gray-500">{slot.doctor.name}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Unavailable Slots */}
        {unavailableSlots.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              {t('availability.unavailableSlots')} ({unavailableSlots.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {unavailableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant="outline"
                  disabled
                  className="h-12 opacity-50 cursor-not-allowed"
                >
                  <span className="font-medium">{slot.time}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOperatingHours = () => {
    if (!availability?.operating_hours) return null;

    const hours = availability.operating_hours;
    
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {t('availability.operatingHours')}
        </h4>
        <div className="flex justify-between items-center">
          <span className="capitalize">{hours.day_name}</span>
          <span>
            {hours.is_closed ? (
              <Badge variant="destructive">{t('availability.closed')}</Badge>
            ) : hours.is_24_hours ? (
              <Badge className="bg-green-500">{t('availability.hours24')}</Badge>
            ) : (
              `${hours.open_time} - ${hours.close_time}`
            )}
          </span>
        </div>
      </div>
    );
  };

  if (loading && !availability) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          {t('availability.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="branch">{t('availability.branch')}</Label>
              <Select
                value={selectedBranchId.toString()}
                onValueChange={(value) => handleBranchChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('availability.selectBranch')} />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">{t('availability.service')}</Label>
              <Select
                value={selectedServiceId.toString()}
                onValueChange={(value) => setSelectedServiceId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('availability.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('availability.anyService')}</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doctor">{t('availability.doctor')}</Label>
              <Select
                value={selectedDoctorId.toString()}
                onValueChange={(value) => setSelectedDoctorId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('availability.selectDoctor')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('availability.anyDoctor')}</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">{t('availability.date')}</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={checkAvailability}
              disabled={loading || !selectedBranchId || !selectedDate}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('availability.refresh')}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Availability Status */}
          {availability && (
            <div className="space-y-4">
              {/* Status Message */}
              {(() => {
                const status = getAvailabilityStatus();
                if (!status) return null;

                return (
                  <Alert className={`${status.bgColor} ${status.borderColor}`}>
                    <div className="flex items-center gap-2">
                      {status.status === 'available' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={status.color}>
                        {status.message}
                      </AlertDescription>
                    </div>
                  </Alert>
                );
              })()}

              {/* Selected Date */}
              {selectedDate && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formatDate(selectedDate)}
                  </h3>
                </div>
              )}

              {/* Operating Hours */}
              {renderOperatingHours()}

              {/* Time Slots */}
              {renderTimeSlots()}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">{t('availability.checking')}</span>
                </div>
              )}
            </div>
          )}

          {/* No Selection Message */}
          {!selectedBranchId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('availability.selectBranchFirst')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityChecker;
