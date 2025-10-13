import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <span className="text-xl font-heading text-background">E</span>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Elite Wellness</h3>
                <p className="text-xs text-background/70">Professional Healthcare</p>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Your trusted partner in health and wellness across Malaysia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-sm text-background/80 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#services" className="text-sm text-background/80 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#doctors" className="text-sm text-background/80 hover:text-primary transition-colors">Our Doctors</a></li>
              <li><a href="#branches" className="text-sm text-background/80 hover:text-primary transition-colors">Locations</a></li>
              <li><a href="#booking" className="text-sm text-background/80 hover:text-primary transition-colors">Book Appointment</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-sm text-background/80">Physiotherapy</li>
              <li className="text-sm text-background/80">Therapeutic Massage</li>
              <li className="text-sm text-background/80">Medical Consultation</li>
              <li className="text-sm text-background/80">Sports Medicine</li>
              <li className="text-sm text-background/80">Pain Management</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-background/80">
                  Level 5, Pavilion KL<br />
                  Kuala Lumpur, Malaysia
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+60321428888" className="text-sm text-background/80 hover:text-primary transition-colors">
                  +603-2142 8888
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@elitewellness.my" className="text-sm text-background/80 hover:text-primary transition-colors">
                  info@elitewellness.my
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © 2025 Elite Wellness Clinic. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-background/60 hover:text-primary transition-colors">PDPA Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
