import React, { useState, useEffect, useCallback } from 'react';
import { Star, MapPin, Clock, Award, Languages, Calendar, Users, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, Doctor, Branch } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

interface DoctorsProps {
  onDoctorSelect?: (doctor: Doctor) => void;
  onBookAppointment?: (doctor: Doctor) => void;
  selectedBranchId?: number;
}

const Doctors: React.FC<DoctorsProps> = ({ 
  onDoctorSelect, 
  onBookAppointment, 
  selectedBranchId 
}) => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (selectedBranchId) {
        response = await apiService.getDoctorsByBranch(selectedBranchId);
      } else {
        response = await apiService.getDoctors();
      }
      
      if (response.success && response.data) {
        setDoctors(response.data);
        
        // Extract unique specializations
        const uniqueSpecializations = [...new Set(
          response.data.map(doctor => doctor.specialization).filter(Boolean)
        )];
        setSpecializations(uniqueSpecializations);
      } else {
        setError(response.message || 'Failed to load doctors');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  const applyFilters = useCallback(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialization filter
    if (selectedSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }

    // Experience filter
    if (selectedExperience) {
      const [minYears] = selectedExperience.split('-').map(Number);
      const maxYears = selectedExperience.includes('+') ? Infinity : Number(selectedExperience.split('-')[1]);
      
      filtered = filtered.filter(doctor => {
        if (!doctor.experience_years) return false;
        return doctor.experience_years >= minYears && doctor.experience_years <= maxYears;
      });
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedExperience, selectedSpecialization]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    onDoctorSelect?.(doctor);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    onBookAppointment?.(doctor);
  };

  const getExperienceBadge = (years?: number) => {
    if (!years) return null;
    
    if (years >= 10) {
      return <Badge className="bg-purple-500 text-white">{t('doctors.experienced')}</Badge>;
    } else if (years >= 5) {
      return <Badge className="bg-blue-500 text-white">{t('doctors.senior')}</Badge>;
    } else {
      return <Badge className="bg-green-500 text-white">{t('doctors.junior')}</Badge>;
    }
  };

  const getLanguageBadges = (languages?: string[]) => {
    if (!languages || languages.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {languages.map((language, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {language}
          </Badge>
        ))}
      </div>
    );
  };

  const renderDoctorCard = (doctor: Doctor) => {
    const experienceBadge = getExperienceBadge(doctor.experience_years);
    const languageBadges = getLanguageBadges(doctor.languages);
    
    return (
      <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {doctor.image ? (
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                {doctor.name}
              </CardTitle>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {doctor.specialization}
                </Badge>
                {experienceBadge}
                {doctor.is_active && (
                  <Badge className="bg-green-500 text-white">
                    {t('doctors.available')}
                  </Badge>
                )}
              </div>
              
              {doctor.qualification && (
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">{doctor.qualification}</span>
                </div>
              )}
              
              {languageBadges}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Bio */}
            {doctor.bio && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('doctors.about')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Experience */}
            {doctor.experience_years && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">
                  {doctor.experience_years} {t('doctors.yearsExperience')}
                </span>
              </div>
            )}

            {/* Branches */}
            {doctor.branches && doctor.branches.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('doctors.availableAt')} ({doctor.branches.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {doctor.branches.slice(0, 4).map((branch) => (
                    <div key={branch.id} className="p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium text-gray-800">{branch.name}</p>
                      <p className="text-gray-600">{branch.address}</p>
                    </div>
                  ))}
                </div>
                {doctor.branches.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{doctor.branches.length - 4} {t('doctors.moreBranches')}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDoctorSelect(doctor)}
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                {t('doctors.viewProfile')}
              </Button>
              <Button
                size="sm"
                onClick={() => handleBookAppointment(doctor)}
                disabled={!doctor.is_active}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('doctors.bookAppointment')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
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
            onClick={loadDoctors}
          >
            {t('doctors.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('doctors.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('doctors.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('doctors.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('doctors.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder={t('doctors.specialization')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('doctors.allSpecializations')}</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger>
                <SelectValue placeholder={t('doctors.experience')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('doctors.allExperience')}</SelectItem>
                <SelectItem value="0-2">{t('doctors.experience0to2')}</SelectItem>
                <SelectItem value="3-5">{t('doctors.experience3to5')}</SelectItem>
                <SelectItem value="6-10">{t('doctors.experience6to10')}</SelectItem>
                <SelectItem value="10+">{t('doctors.experience10plus')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
                setSelectedExperience('');
              }}
            >
              {t('doctors.clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {t('doctors.showingResults', { count: filteredDoctors.length, total: doctors.length })}
          </p>
          {selectedBranchId && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {t('doctors.filteredByBranch')}
            </Badge>
          )}
        </div>

        {filteredDoctors.length === 0 ? (
          <Alert>
            <AlertDescription>
              {t('doctors.noDoctorsFound')}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map(renderDoctorCard)}
          </div>
        )}
      </div>

      {selectedDoctor && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            {t('doctors.selectedDoctor')}: {selectedDoctor.name}
          </h3>
          <p className="text-blue-600">{selectedDoctor.specialization}</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
