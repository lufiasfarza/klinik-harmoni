import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink, Calendar, Users, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, Branch, Doctor, Service, OperatingHour } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

interface BranchesProps {
  onBranchSelect?: (branch: Branch) => void;
  onBookAppointment?: (branch: Branch) => void;
}

const Branches: React.FC<BranchesProps> = ({ onBranchSelect, onBookAppointment }) => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getBranches();
      
      if (response.success && response.data) {
        setBranches(response.data);
      } else {
        setError(response.message || 'Failed to load branches');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to load branches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    onBranchSelect?.(branch);
  };

  const handleBookAppointment = (branch: Branch) => {
    onBookAppointment?.(branch);
  };

  const toggleBranchExpansion = (branchId: number) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

  const formatOperatingHours = (hours: OperatingHour[]): string => {
    if (!hours || hours.length === 0) return t('branches.hoursNotAvailable');
    
    const has24Hours = hours.some(h => h.is_24_hours);
    if (has24Hours) return t('branches.hours24');
    
    const weekdayHours = hours.find(h => 
      !['saturday', 'sunday'].includes(h.day_of_week) && !h.is_closed
    );
    const weekendHours = hours.find(h => 
      ['saturday', 'sunday'].includes(h.day_of_week) && !h.is_closed
    );
    
    const formatted = [];
    if (weekdayHours) {
      formatted.push(`${t('branches.weekdays')}: ${weekdayHours.open_time} - ${weekdayHours.close_time}`);
    }
    if (weekendHours) {
      formatted.push(`${t('branches.weekends')}: ${weekendHours.open_time} - ${weekendHours.close_time}`);
    }
    
    return formatted.length > 0 ? formatted.join(', ') : t('branches.hoursNotAvailable');
  };

  const getBranchStatus = (branch: Branch): { status: string; color: string } => {
    if (!branch.is_active) {
      return { status: t('branches.statusInactive'), color: 'bg-gray-500' };
    }
    
    // Check if branch is currently open
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = branch.hours?.find(h => h.day_of_week === currentDay);
    
    if (todayHours?.is_closed) {
      return { status: t('branches.statusClosed'), color: 'bg-red-500' };
    }
    
    if (todayHours?.is_24_hours) {
      return { status: t('branches.statusOpen'), color: 'bg-green-500' };
    }
    
    if (todayHours && currentTime >= todayHours.open_time && currentTime <= todayHours.close_time) {
      return { status: t('branches.statusOpen'), color: 'bg-green-500' };
    }
    
    return { status: t('branches.statusClosed'), color: 'bg-red-500' };
  };

  const renderBranchCard = (branch: Branch) => {
    const isExpanded = expandedBranch === branch.id;
    const branchStatus = getBranchStatus(branch);
    const operatingHours = formatOperatingHours(branch.hours || []);
    
    return (
      <Card key={branch.id} className="mb-6 hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                {branch.name}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${branchStatus.color} text-white`}>
                  {branchStatus.status}
                </Badge>
                {branch.is_active && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {t('branches.active')}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleBranchExpansion(branch.id)}
              >
                {isExpanded ? t('branches.showLess') : t('branches.showMore')}
              </Button>
              <Button
                size="sm"
                onClick={() => handleBookAppointment(branch)}
                disabled={!branch.is_active}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('branches.bookNow')}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">{t('branches.address')}</p>
                  <p className="text-gray-600">{branch.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">{t('branches.phone')}</p>
                  <p className="text-gray-600">{branch.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">{t('branches.operatingHours')}</p>
                  <p className="text-gray-600">{operatingHours}</p>
                </div>
              </div>
              
              {branch.latitude && branch.longitude && (
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-700">{t('branches.location')}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://maps.google.com/?q=${branch.latitude},${branch.longitude}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Google Maps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://waze.com/ul?q=${branch.latitude},${branch.longitude}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Waze
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t pt-4 space-y-4">
                {/* Services */}
                {branch.services && branch.services.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {t('branches.availableServices')} ({branch.services.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {branch.services.slice(0, 6).map((service) => (
                        <div key={service.id} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800">{service.name}</h5>
                          <p className="text-sm text-gray-600">{service.price_range_display}</p>
                          <p className="text-xs text-gray-500">{service.duration_minutes} {t('branches.minutes')}</p>
                        </div>
                      ))}
                    </div>
                    {branch.services.length > 6 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{branch.services.length - 6} {t('branches.moreServices')}
                      </p>
                    )}
                  </div>
                )}

                {/* Doctors */}
                {branch.doctors && branch.doctors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t('branches.availableDoctors')} ({branch.doctors.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {branch.doctors.slice(0, 6).map((doctor) => (
                        <div key={doctor.id} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800">{doctor.name}</h5>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          {doctor.experience_years && (
                            <p className="text-xs text-gray-500">
                              {doctor.experience_years} {t('branches.yearsExperience')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {branch.doctors.length > 6 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{branch.doctors.length - 6} {t('branches.moreDoctors')}
                      </p>
                    )}
                  </div>
                )}

                {/* Detailed Operating Hours */}
                {branch.hours && branch.hours.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">{t('branches.detailedHours')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {branch.hours.map((hour) => (
                        <div key={hour.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium capitalize">{hour.day_name}</span>
                          <span className="text-sm">
                            {hour.is_closed ? (
                              <Badge variant="destructive">{t('branches.closed')}</Badge>
                            ) : hour.is_24_hours ? (
                              <Badge className="bg-green-500">{t('branches.hours24')}</Badge>
                            ) : (
                              `${hour.open_time} - ${hour.close_time}`
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={loadBranches}
          >
            {t('branches.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (branches.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          {t('branches.noBranchesFound')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('branches.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('branches.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {branches.map(renderBranchCard)}
      </div>

      {selectedBranch && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            {t('branches.selectedBranch')}: {selectedBranch.name}
          </h3>
          <p className="text-blue-600">{selectedBranch.address}</p>
        </div>
      )}
    </div>
  );
};

export default Branches;
