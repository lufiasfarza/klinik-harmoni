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
  tagline: 'Professional Healthcare Excellence',
  email: 'info@klinikharmoni.my',
  phone: '+603 2142 8888',
  whatsapp: '+60321428888',
  address: 'Kuala Lumpur, Malaysia',
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
        setClinicInfo({
          ...defaultClinicInfo,
          ...response.data,
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
