import { Helmet } from "react-helmet-async";
import { useClinic } from "@/contexts/ClinicContext";

interface StructuredDataProps {
  type: 'organization' | 'medicalbusiness' | 'breadcrumb' | 'faq';
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const { clinicInfo } = useClinic();

  const getStructuredData = () => {
    const clinicName = clinicInfo?.name || 'Klinik Harmoni';
    const clinicEmail = clinicInfo?.email || 'info@klinikharmoni.my';
    const clinicPhone = clinicInfo?.phone || '+60 3-1234 5678';
    const clinicAddress = clinicInfo?.address || 'Kuala Lumpur, Malaysia';

    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": clinicName,
          "description": clinicInfo?.tagline || "Professional healthcare services across Malaysia with experienced medical professionals and modern facilities.",
          "url": "https://klinikharmoni.my",
          "logo": "https://klinikharmoni.my/logo.png",
          "image": "https://klinikharmoni.my/hero-image.jpg",
          "telephone": clinicPhone,
          "email": clinicEmail,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MY",
            "streetAddress": clinicAddress,
            "addressLocality": "Kuala Lumpur",
            "addressRegion": "Kuala Lumpur"
          },
          "sameAs": [
            clinicInfo?.facebook,
            clinicInfo?.instagram,
            clinicInfo?.linkedin
          ].filter(Boolean),
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Healthcare Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalProcedure",
                  "name": "General Consultation",
                  "description": "Professional medical consultation services"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalProcedure",
                  "name": "Health Screening",
                  "description": "Comprehensive health screening packages"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalProcedure",
                  "name": "Medical Consultation",
                  "description": "General medical consultation"
                }
              }
            ]
          },
          "medicalSpecialty": [
            "General Practice",
            "Family Medicine",
            "Occupational Health"
          ]
        };

      case 'medicalbusiness':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": clinicName,
          "description": clinicInfo?.tagline || "Professional healthcare excellence",
          "url": "https://klinikharmoni.my",
          "telephone": clinicPhone,
          "email": clinicEmail,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MY",
            "streetAddress": clinicAddress,
            "addressLocality": "Kuala Lumpur"
          },
          "openingHours": "Mo-Su 00:00-23:59",
          "priceRange": "$$",
          "currenciesAccepted": "MYR",
          "paymentAccepted": "Cash, Credit Card, Insurance",
          "medicalSpecialty": "General Practice, Family Medicine, Occupational Health"
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data?.breadcrumbs?.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data?.faqs?.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
