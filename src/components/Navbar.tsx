import { useState } from "react";
import { Menu, X, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useClinic } from "@/contexts/ClinicContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { clinicInfo } = useClinic();

  const navigation = [
    { name: t('nav.home'), href: "#home" },
    { name: t('nav.branches'), href: "#branches" },
    { name: t('nav.services'), href: "#services" },
    { name: t('nav.doctors'), href: "#doctors" },
    { name: t('nav.bookNow'), href: "#booking" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {clinicInfo?.logo ? (
              <img
                src={clinicInfo.logo}
                alt={clinicInfo?.name || 'Klinik Harmoni'}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <span className="text-2xl font-heading text-primary-foreground">
                  {clinicInfo?.name?.charAt(0) || 'K'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-heading font-semibold text-foreground">
                {clinicInfo?.name || 'Klinik Harmoni'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {clinicInfo?.tagline || 'Professional Healthcare'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Language Switcher & Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {i18n.language === 'ms' ? 'BM' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ms')} className="cursor-pointer">
                  Bahasa Melayu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              {t('nav.contactUs')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border animate-fade-in">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="px-4 pt-2 space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full gap-2 justify-center">
                    <Globe className="h-4 w-4" />
                    {i18n.language === 'ms' ? 'Bahasa Melayu' : 'English'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background">
                  <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('ms')} className="cursor-pointer">
                    Bahasa Melayu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Phone className="h-4 w-4" />
                {t('nav.contactUs')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
