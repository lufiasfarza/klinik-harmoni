import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: 'organization' | 'medicalbusiness' | 'breadcrumb' | 'faq';
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "Klinik Harmoni",
          "description": "Professional healthcare services across Malaysia with experienced medical professionals and modern facilities.",
          "url": "https://klinikharmoni.my",
          "logo": "https://klinikharmoni.my/logo.png",
          "image": "https://klinikharmoni.my/hero-image.jpg",
          "telephone": "+60 3-1234 5678",
          "email": "info@klinikharmoni.my",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MY",
            "addressLocality": "Kuala Lumpur",
            "addressRegion": "Kuala Lumpur"
          },
          "sameAs": [
            "https://www.facebook.com/elitewellness",
            "https://www.instagram.com/elitewellness",
            "https://www.linkedin.com/company/elitewellness"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Healthcare Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalProcedure",
                  "name": "Physiotherapy",
                  "description": "Professional physiotherapy services"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalProcedure",
                  "name": "Therapeutic Massage",
                  "description": "Therapeutic massage therapy"
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
            "Physiotherapy",
            "General Practice",
            "Sports Medicine",
            "Rehabilitation"
          ]
        };

      case 'medicalbusiness':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "Elite Wellness",
          "description": "Award-winning healthcare excellence with 13 branches nationwide",
          "url": "https://elitewellness.com",
          "telephone": "+60 3-1234 5678",
          "email": "info@elitewellness.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MY",
            "addressLocality": "Kuala Lumpur"
          },
          "openingHours": "Mo-Fr 09:00-18:00,Sa 09:00-13:00",
          "priceRange": "$$",
          "currenciesAccepted": "MYR",
          "paymentAccepted": "Cash, Credit Card, Insurance",
          "medicalSpecialty": "Physiotherapy, General Practice, Sports Medicine"
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
