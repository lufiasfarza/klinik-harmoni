import React, { useState, useEffect } from 'react';
import { Calendar, Users, Stethoscope, MapPin, Bell, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBranches from '@/components/EnhancedBranches';
import EnhancedDoctors from '@/components/EnhancedDoctors';
import EnhancedServices from '@/components/EnhancedServices';
import EnhancedBookingForm from '@/components/EnhancedBookingForm';
import EnhancedAvailabilityChecker from '@/components/EnhancedAvailabilityChecker';
import { Branch, Doctor, Service, TimeSlot, AvailabilityData } from '@/services/enhanced-api';
import { useTranslation } from 'react-i18next';

type ActiveTab = 'branches' | 'doctors' | 'services' | 'booking' | 'availability';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('branches');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const tabs = [
    { id: 'branches' as ActiveTab, label: t('app.branches'), icon: MapPin },
    { id: 'doctors' as ActiveTab, label: t('app.doctors'), icon: Users },
    { id: 'services' as ActiveTab, label: t('app.services'), icon: Stethoscope },
    { id: 'availability' as ActiveTab, label: t('app.availability'), icon: Calendar },
    { id: 'booking' as ActiveTab, label: t('app.booking'), icon: Calendar },
  ];

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    addNotification(`${t('app.branchSelected')}: ${branch.name}`);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    addNotification(`${t('app.doctorSelected')}: ${doctor.name}`);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    addNotification(`${t('app.serviceSelected')}: ${service.name}`);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    addNotification(`${t('app.timeSlotSelected')}: ${timeSlot.time}`);
  };

  const handleAvailabilityChange = (availability: AvailabilityData) => {
    setAvailability(availability);
  };

  const handleBookAppointment = (item: Branch | Doctor | Service) => {
    if ('name' in item && 'address' in item) {
      // It's a branch
      setSelectedBranch(item as Branch);
    } else if ('specialization' in item) {
      // It's a doctor
      setSelectedDoctor(item as Doctor);
    } else if ('price' in item) {
      // It's a service
      setSelectedService(item as Service);
    }
    
    setActiveTab('booking');
    addNotification(t('app.redirectingToBooking'));
  };

  const handleBookingSuccess = (booking: any) => {
    addNotification(t('app.bookingSuccess'));
    // Reset selections
    setSelectedBranch(null);
    setSelectedDoctor(null);
    setSelectedService(null);
    setSelectedTimeSlot(null);
    setActiveTab('branches');
  };

  const handleBookingError = (error: string) => {
    addNotification(`${t('app.bookingError')}: ${error}`);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ms' : 'en';
    i18n.changeLanguage(newLang);
    addNotification(`${t('app.languageChanged')}: ${newLang.toUpperCase()}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'branches':
        return (
          <EnhancedBranches
            onBranchSelect={handleBranchSelect}
            onBookAppointment={handleBookAppointment}
          />
        );
      case 'doctors':
        return (
          <EnhancedDoctors
            selectedBranchId={selectedBranch?.id}
            onDoctorSelect={handleDoctorSelect}
            onBookAppointment={handleBookAppointment}
          />
        );
      case 'services':
        return (
          <EnhancedServices
            selectedBranchId={selectedBranch?.id}
            onServiceSelect={handleServiceSelect}
            onBookAppointment={handleBookAppointment}
          />
        );
      case 'availability':
        return (
          <EnhancedAvailabilityChecker
            selectedBranch={selectedBranch}
            selectedDoctor={selectedDoctor}
            selectedService={selectedService}
            onTimeSlotSelect={handleTimeSlotSelect}
            onAvailabilityChange={handleAvailabilityChange}
          />
        );
      case 'booking':
        return (
          <EnhancedBookingForm
            selectedBranch={selectedBranch}
            selectedDoctor={selectedDoctor}
            selectedService={selectedService}
            onBookingSuccess={handleBookingSuccess}
            onBookingError={handleBookingError}
          />
        );
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">{t('app.title')}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full mb-2"
          onClick={toggleLanguage}
        >
          {i18n.language === 'en' ? 'Bahasa Melayu' : 'English'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => addNotification(t('app.settingsClicked'))}
        >
          <Settings className="w-4 h-4 mr-2" />
          {t('app.settings')}
        </Button>
      </div>
    </div>
  );

  const renderNotifications = () => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification, index) => (
          <Alert key={index} className="shadow-lg">
            <Bell className="h-4 w-4" />
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={clearNotifications}
          className="w-full"
        >
          {t('app.clearNotifications')}
        </Button>
      </div>
    );
  };

  const renderSelectionSummary = () => {
    const hasSelection = selectedBranch || selectedDoctor || selectedService || selectedTimeSlot;
    
    if (!hasSelection) return null;

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-700 mb-3">{t('app.currentSelection')}</h3>
          <div className="flex flex-wrap gap-2">
            {selectedBranch && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedBranch.name}
              </Badge>
            )}
            {selectedDoctor && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Users className="w-3 h-3 mr-1" />
                {selectedDoctor.name}
              </Badge>
            )}
            {selectedService && (
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                <Stethoscope className="w-3 h-3 mr-1" />
                {selectedService.name}
              </Badge>
            )}
            {selectedTimeSlot && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Calendar className="w-3 h-3 mr-1" />
                {selectedTimeSlot.time}
              </Badge>
            )}
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBranch(null);
                setSelectedDoctor(null);
                setSelectedService(null);
                setSelectedTimeSlot(null);
                addNotification(t('app.selectionCleared'));
              }}
            >
              {t('app.clearSelection')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">{t('app.title')}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
          >
            {i18n.language === 'en' ? 'MS' : 'EN'}
          </Button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{t('app.title')}</h1>
                  <p className="text-gray-600 mt-2">{t('app.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={toggleLanguage}
                  >
                    {i18n.language === 'en' ? 'Bahasa Melayu' : 'English'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addNotification(t('app.settingsClicked'))}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('app.settings')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            {renderSelectionSummary()}

            {/* Tab Content */}
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {renderNotifications()}
    </div>
  );
};

export default App;
