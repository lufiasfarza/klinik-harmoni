import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiService, Branch, Doctor, Service, TimeSlot, Booking } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

interface BookingFormProps {
  selectedBranch?: Branch;
  selectedDoctor?: Doctor;
  selectedService?: Service;
  onBookingSuccess?: (booking: Booking) => void;
  onBookingError?: (error: string) => void;
}

interface BookingFormData {
  branch_id: number;
  doctor_id?: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  notes?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedBranch,
  selectedDoctor,
  selectedService,
  onBookingSuccess,
  onBookingError
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BookingFormData>({
    branch_id: selectedBranch?.id || 0,
    doctor_id: selectedDoctor?.id,
    service_id: selectedService?.id || 0,
    appointment_date: '',
    appointment_time: '',
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    notes: ''
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const loadInitialData = useCallback(async () => {
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
  }, []);

  const loadBranchData = useCallback(async (branchId: number) => {
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
  }, []);

  const loadTimeSlots = useCallback(async () => {
    try {
      if (!formData.branch_id || !formData.appointment_date) return;

      const response = await apiService.getBranchAvailability(
        formData.branch_id,
        formData.appointment_date,
        formData.service_id
      );

      if (response.success && response.data?.time_slots) {
        // Filter by doctor if selected
        let availableSlots = response.data.time_slots.filter(slot => slot.available);
        
        if (formData.doctor_id) {
          availableSlots = availableSlots.filter(slot => 
            slot.doctor?.id === formData.doctor_id
          );
        }

        setTimeSlots(availableSlots);
      } else {
        setTimeSlots([]);
      }
    } catch (err) {
      console.error('Failed to load time slots:', err);
      setTimeSlots([]);
    }
  }, [formData.appointment_date, formData.branch_id, formData.doctor_id, formData.service_id]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedBranch) {
      setFormData(prev => ({ ...prev, branch_id: selectedBranch.id }));
      loadBranchData(selectedBranch.id);
    }
  }, [selectedBranch, loadBranchData]);

  useEffect(() => {
    if (selectedDoctor) {
      setFormData(prev => ({ ...prev, doctor_id: selectedDoctor.id }));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service_id: selectedService.id }));
    }
  }, [selectedService]);

  useEffect(() => {
    if (formData.branch_id && formData.appointment_date) {
      loadTimeSlots();
    }
  }, [formData.branch_id, formData.appointment_date, loadTimeSlots]);

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleBranchChange = (branchId: number) => {
    handleInputChange('branch_id', branchId);
    handleInputChange('doctor_id', 0); // Reset doctor selection
    loadBranchData(branchId);
  };

  const handleDateChange = (date: string) => {
    handleInputChange('appointment_date', date);
    handleInputChange('appointment_time', ''); // Reset time selection
  };

  const validateForm = (): boolean => {
    if (!formData.branch_id) {
      setError('Please select a branch');
      return false;
    }
    if (!formData.service_id) {
      setError('Please select a service');
      return false;
    }
    if (!formData.appointment_date) {
      setError('Please select an appointment date');
      return false;
    }
    if (!formData.appointment_time) {
      setError('Please select an appointment time');
      return false;
    }
    if (!formData.patient_name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.patient_phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.patient_email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.patient_email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await apiService.createBooking(formData);

      if (response.success) {
        setSuccess('Appointment booked successfully! You will receive a confirmation email shortly.');
        onBookingSuccess?.(response.data);
        
        // Reset form
        setFormData({
          branch_id: selectedBranch?.id || 0,
          doctor_id: selectedDoctor?.id,
          service_id: selectedService?.id || 0,
          appointment_date: '',
          appointment_time: '',
          patient_name: '',
          patient_phone: '',
          patient_email: '',
          notes: ''
        });
        setCurrentStep(1);
      } else {
        setError(response.message || 'Failed to book appointment');
        onBookingError?.(response.message || 'Failed to book appointment');
      }
    } catch (err) {
      const errorMessage = 'Network error occurred. Please try again.';
      setError(errorMessage);
      onBookingError?.(errorMessage);
      console.error('Booking submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {t('booking.step1Title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branch">{t('booking.branch')} *</Label>
          <Select
            value={formData.branch_id.toString()}
            onValueChange={(value) => handleBranchChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('booking.selectBranch')} />
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
          <Label htmlFor="service">{t('booking.service')} *</Label>
          <Select
            value={formData.service_id.toString()}
            onValueChange={(value) => handleInputChange('service_id', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('booking.selectService')} />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name} - {service.price_range_display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.branch_id && (
        <div>
          <Label htmlFor="doctor">{t('booking.doctor')} ({t('booking.optional')})</Label>
          <Select
            value={formData.doctor_id?.toString() || ''}
            onValueChange={(value) => handleInputChange('doctor_id', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('booking.selectDoctor')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('booking.anyDoctor')}</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name} - {doctor.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        {t('booking.step2Title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">{t('booking.date')} *</Label>
          <Input
            id="date"
            type="date"
            value={formData.appointment_date}
            onChange={(e) => handleDateChange(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
          />
        </div>

        <div>
          <Label htmlFor="time">{t('booking.time')} *</Label>
          <Select
            value={formData.appointment_time}
            onValueChange={(value) => handleInputChange('appointment_time', value)}
            disabled={!formData.appointment_date || timeSlots.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('booking.selectTime')} />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot.time} value={slot.time}>
                  {slot.time} {slot.doctor && `- ${slot.doctor.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.appointment_date && timeSlots.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('booking.noSlotsAvailable')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <User className="w-5 h-5" />
        {t('booking.step3Title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('booking.patientName')} *</Label>
          <Input
            id="name"
            value={formData.patient_name}
            onChange={(e) => handleInputChange('patient_name', e.target.value)}
            placeholder={t('booking.enterName')}
          />
        </div>

        <div>
          <Label htmlFor="phone">{t('booking.patientPhone')} *</Label>
          <Input
            id="phone"
            value={formData.patient_phone}
            onChange={(e) => handleInputChange('patient_phone', e.target.value)}
            placeholder={t('booking.enterPhone')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">{t('booking.patientEmail')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.patient_email}
          onChange={(e) => handleInputChange('patient_email', e.target.value)}
          placeholder={t('booking.enterEmail')}
        />
      </div>

      <div>
        <Label htmlFor="notes">{t('booking.notes')} ({t('booking.optional')})</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder={t('booking.enterNotes')}
          rows={3}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
          {t('booking.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              {t('booking.previous')}
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!formData.branch_id || !formData.service_id)) ||
                  (currentStep === 2 && (!formData.appointment_date || !formData.appointment_time))
                }
              >
                {t('booking.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="min-w-[120px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('booking.booking')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('booking.confirmBooking')}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
