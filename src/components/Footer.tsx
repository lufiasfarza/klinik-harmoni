import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClinic } from "@/contexts/ClinicContext";

const Footer = () => {
  const { t } = useTranslation();
  const { clinicInfo } = useClinic();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {clinicInfo?.logo ? (
                <img
                  src={clinicInfo.logo}
                  alt={clinicInfo?.name || 'Klinik Harmoni'}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                  <span className="text-xl font-heading text-background">
                    {clinicInfo?.name?.charAt(0) || 'K'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-heading font-semibold text-lg">
                  {clinicInfo?.name || 'Klinik Harmoni'}
                </h3>
                <p className="text-xs text-background/70">
                  {clinicInfo?.tagline || t('footer.tagline')}
                </p>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-background">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-sm text-background/80 hover:text-primary transition-colors">{t('footer.home')}</a></li>
              <li><a href="#services" className="text-sm text-background/80 hover:text-primary transition-colors">{t('footer.services')}</a></li>
              <li><a href="#doctors" className="text-sm text-background/80 hover:text-primary transition-colors">{t('footer.doctors')}</a></li>
              <li><a href="#branches" className="text-sm text-background/80 hover:text-primary transition-colors">{t('footer.locations')}</a></li>
              <li><a href="#booking" className="text-sm text-background/80 hover:text-primary transition-colors">{t('footer.bookAppointment')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-background">{t('footer.ourServices')}</h4>
            <ul className="space-y-2">
              <li className="text-sm text-background/80">{t('footer.physiotherapy')}</li>
              <li className="text-sm text-background/80">{t('footer.massage')}</li>
              <li className="text-sm text-background/80">{t('footer.sports')}</li>
              <li className="text-sm text-background/80">{t('footer.rehabilitation')}</li>
              <li className="text-sm text-background/80">{t('footer.wellness')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-background/80">
                  {clinicInfo?.address || t('footer.address')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${clinicInfo?.phone || '+60321428888'}`}
                  className="text-sm text-background/80 hover:text-primary transition-colors"
                >
                  {clinicInfo?.phone || t('footer.phone')}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${clinicInfo?.email || 'info@klinikharmoni.my'}`}
                  className="text-sm text-background/80 hover:text-primary transition-colors"
                >
                  {clinicInfo?.email || t('footer.email')}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              {clinicInfo?.facebook && (
                <a href={clinicInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {clinicInfo?.instagram && (
                <a href={clinicInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {clinicInfo?.tiktok && (
                <a href={clinicInfo.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
              {clinicInfo?.linkedin && (
                <a href={clinicInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {!clinicInfo?.facebook && !clinicInfo?.instagram && !clinicInfo?.tiktok && !clinicInfo?.linkedin && (
                <>
                  <a href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} {clinicInfo?.name || 'Klinik Harmoni'}. {t('footer.allRightsReserved', 'All rights reserved.')}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">{t('footer.terms')}</a>
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">{t('footer.pdpa')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
