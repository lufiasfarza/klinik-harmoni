import { Helmet } from "react-helmet-async";
import { useClinic } from "@/contexts/ClinicContext";

interface DynamicHeadProps {
  title?: string;
  description?: string;
}

const DynamicHead = ({ title, description }: DynamicHeadProps) => {
  const { clinicInfo } = useClinic();

  const clinicName = clinicInfo?.name || 'Klinik Harmoni';
  const defaultDescription = clinicInfo?.tagline || 'Professional Healthcare Excellence';
  const seoTitle = clinicInfo?.seo?.title;
  const seoDescription = clinicInfo?.seo?.description;

  const pageTitle = title
    ? `${title} | ${clinicName}`
    : seoTitle || `${clinicName} - ${defaultDescription}`;

  const pageDescription = description || seoDescription || defaultDescription;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );
};

export default DynamicHead;
