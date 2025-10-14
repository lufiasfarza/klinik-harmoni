import React, { useState, useEffect } from 'react';
import { Stethoscope, Clock, DollarSign, MapPin, Filter, Search, Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiService, Service, Branch } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

interface ServicesProps {
  onServiceSelect?: (service: Service) => void;
  onBookAppointment?: (service: Service) => void;
  selectedBranchId?: number;
}

const Services: React.FC<ServicesProps> = ({ 
  onServiceSelect, 
  onBookAppointment, 
  selectedBranchId 
}) => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, [selectedBranchId]);

  useEffect(() => {
    applyFilters();
  }, [services, searchTerm, selectedCategory, priceRange]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (selectedBranchId) {
        response = await apiService.getServicesByBranch(selectedBranchId);
      } else {
        response = await apiService.getServices();
      }
      
      if (response.success && response.data) {
        setServices(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(
          response.data.map(service => service.category).filter(Boolean)
        )];
        setCategories(uniqueCategories);
      } else {
        setError(response.message || 'Failed to load services');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Price range filter
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filtered = filtered.filter(service => {
        if (maxPrice) {
          return service.min_price >= minPrice && service.max_price <= maxPrice;
        } else {
          return service.min_price >= minPrice;
        }
      });
    }

    setFilteredServices(filtered);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setServiceModalOpen(true);
    onServiceSelect?.(service);
  };

  const handleBookAppointment = (service: Service) => {
    onBookAppointment?.(service);
  };

  const getPriceRangeBadge = (service: Service) => {
    const priceDiff = service.max_price - service.min_price;
    
    if (priceDiff === 0) {
      return <Badge className="bg-green-500 text-white">RM{service.price}</Badge>;
    } else if (priceDiff <= 20) {
      return <Badge className="bg-blue-500 text-white">{service.price_range_display}</Badge>;
    } else {
      return <Badge className="bg-orange-500 text-white">{service.price_range_display}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'General Consultation': <Stethoscope className="w-5 h-5" />,
      'Physiotherapy': <Users className="w-5 h-5" />,
      'Vaccination': <Star className="w-5 h-5" />,
      'Health Screening': <Clock className="w-5 h-5" />,
      'Skin Treatment': <Star className="w-5 h-5" />,
      'Alternative Therapy': <Star className="w-5 h-5" />,
      'Eye Examination': <Star className="w-5 h-5" />,
    };
    
    return iconMap[category] || <Stethoscope className="w-5 h-5" />;
  };

  const renderServiceCard = (service: Service) => {
    const priceBadge = getPriceRangeBadge(service);
    const categoryIcon = getCategoryIcon(service.category);
    
    return (
      <Card key={service.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {categoryIcon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-800 mb-1">
                  {service.name}
                </CardTitle>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {service.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {priceBadge}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Description */}
            {service.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            )}

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">
                  {service.duration_minutes} {t('services.minutes')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  {service.price_range_display}
                </span>
              </div>
            </div>

            {/* Available Branches */}
            {service.branches_offering_service && service.branches_offering_service.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('services.availableAt')} ({service.branches_offering_service.length})
                </h4>
                <div className="space-y-2">
                  {service.branches_offering_service.slice(0, 3).map((branch) => (
                    <div key={branch.id} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{branch.name}</p>
                          <p className="text-gray-600">{branch.address}</p>
                          <p className="text-gray-500">{branch.operating_hours}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          RM{branch.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {service.branches_offering_service.length > 3 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{service.branches_offering_service.length - 3} {t('services.moreBranches')}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleServiceSelect(service)}
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                {t('services.viewDetails')}
              </Button>
              <Button
                size="sm"
                onClick={() => handleBookAppointment(service)}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('services.bookNow')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderServiceModal = () => {
    if (!selectedService) return null;

    return (
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {selectedService.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Service Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">{t('services.price')}</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedService.price_range_display}
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-700">{t('services.duration')}</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {selectedService.duration_minutes} {t('services.minutes')}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-700">{t('services.category')}</span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {selectedService.category}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedService.description && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">{t('services.description')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>
            )}

            {/* Available Branches */}
            {selectedService.branches_offering_service && selectedService.branches_offering_service.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t('services.availableBranches')} ({selectedService.branches_offering_service.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedService.branches_offering_service.map((branch) => (
                    <div key={branch.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                        <Badge className="bg-green-500 text-white">
                          RM{branch.price}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{branch.address}</p>
                      <p className="text-gray-500 text-sm mb-3">{branch.operating_hours}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${branch.phone}`)}
                        >
                          {t('services.call')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://maps.google.com/?q=${branch.address}`)}
                        >
                          {t('services.directions')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setServiceModalOpen(false)}
                className="flex-1"
              >
                {t('services.close')}
              </Button>
              <Button
                onClick={() => {
                  handleBookAppointment(selectedService);
                  setServiceModalOpen(false);
                }}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('services.bookAppointment')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
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
            onClick={loadServices}
          >
            {t('services.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('services.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('services.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('services.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('services.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('services.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder={t('services.priceRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('services.allPrices')}</SelectItem>
                <SelectItem value="0-50">RM0 - RM50</SelectItem>
                <SelectItem value="51-100">RM51 - RM100</SelectItem>
                <SelectItem value="101-200">RM101 - RM200</SelectItem>
                <SelectItem value="200+">RM200+</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange('');
              }}
            >
              {t('services.clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {t('services.showingResults', { count: filteredServices.length, total: services.length })}
          </p>
          {selectedBranchId && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {t('services.filteredByBranch')}
            </Badge>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <Alert>
            <AlertDescription>
              {t('services.noServicesFound')}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map(renderServiceCard)}
          </div>
        )}
      </div>

      {/* Service Modal */}
      {renderServiceModal()}

      {selectedService && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            {t('services.selectedService')}: {selectedService.name}
          </h3>
          <p className="text-blue-600">{selectedService.price_range_display}</p>
        </div>
      )}
    </div>
  );
};

export default Services;
