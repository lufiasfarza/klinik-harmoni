import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, ClinicInfo } from '@/services/api';

interface ClinicContextType {
  clinicInfo: ClinicInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const defaultClinicInfo: ClinicInfo = {
  name: 'Klinik Harmoni',
  tagline: 'Kesihatan Anda Keutamaan Kami',
  contact: {
    email: 'info@klinikharmoni.my',
    phone: '+603 2142 8888',
    whatsapp: '60123456789',
    address: 'Kuala Lumpur, Malaysia',
  },
  social: {},
  trust: {
    metrics: [
      { label: 'Cawangan', value: '13' },
      { label: 'Doktor Berdaftar', value: '50+' },
      { label: 'Pesakit Dilayan', value: '10K+' },
      { label: 'Rating Purata', value: '4.8/5' },
    ],
    badges: ['Berlesen & Berdaftar MOH', 'Pematuhan PDPA', 'Panel Insurans', 'Sokongan WhatsApp'],
    partners: [],
  },
};

const ClinicContext = createContext<ClinicContextType>({
  clinicInfo: defaultClinicInfo,
  loading: true,
  error: null,
  refetch: () => {},
});

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: React.FC<ClinicProviderProps> = ({ children }) => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(defaultClinicInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClinicInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getClinicInfo();
      if (response.success && response.data) {
        const data = response.data;
        setClinicInfo({
          ...defaultClinicInfo,
          ...data,
          contact: {
            ...defaultClinicInfo.contact,
            ...data.contact,
          },
          social: {
            ...defaultClinicInfo.social,
            ...data.social,
          },
          about: {
            ...defaultClinicInfo.about,
            ...data.about,
          },
          seo: {
            ...defaultClinicInfo.seo,
            ...data.seo,
          },
          trust: {
            ...defaultClinicInfo.trust,
            ...data.trust,
            metrics: data.trust?.metrics?.length ? data.trust.metrics : defaultClinicInfo.trust?.metrics,
            badges: data.trust?.badges?.length ? data.trust.badges : defaultClinicInfo.trust?.badges,
            partners: data.trust?.partners?.length ? data.trust.partners : defaultClinicInfo.trust?.partners,
          },
        });
      }
    } catch (err) {
      console.error('Failed to fetch clinic info:', err);
      setError('Failed to load clinic information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicInfo();
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo,
        loading,
        error,
        refetch: fetchClinicInfo,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export default ClinicContext;
