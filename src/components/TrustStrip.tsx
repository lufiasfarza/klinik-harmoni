import { ArrowUpRight, Award, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClinic } from "@/contexts/ClinicContext";

const iconSet = [ShieldCheck, Users, Stethoscope, Award];

const TrustStrip = () => {
  const { t } = useTranslation();
  const { clinicInfo } = useClinic();

  const metrics = clinicInfo?.trust?.metrics ?? [];
  const badges = clinicInfo?.trust?.badges ?? [];
  const partners = clinicInfo?.trust?.partners ?? [];
  const panelTitle = clinicInfo?.trust?.panel_title || t("trust.partnersTitle");
  const panelLinkLabel = clinicInfo?.trust?.panel_link_label || t("trust.viewAllPanels");
  const panelLinkUrl = clinicInfo?.trust?.panel_link_url;

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">{t("trust.kicker")}</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {t("trust.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {t("trust.subtitle")}
          </p>
        </div>

        {metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {metrics.map((metric, index) => {
              const Icon = iconSet[index % iconSet.length];
              return (
                <div
                  key={`${metric.label}-${index}`}
                  className="rounded-2xl border border-primary/10 bg-background/80 backdrop-blur-sm p-6 text-center shadow-soft hover:shadow-elevated transition-all"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                    {metric.value}
                    {metric.suffix ? <span className="text-primary">{metric.suffix}</span> : null}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {badges.length > 0 && (
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center mb-4">
              {t("trust.badgesTitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {(partners.length > 0 || panelLinkUrl) && (
          <div className="mt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {panelTitle}
              </p>
              {panelLinkUrl && (
                <a
                  href={panelLinkUrl}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {panelLinkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {partners.length > 0 && (
              <div className="flex items-center gap-6 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-5 md:gap-6 md:overflow-visible">
                {partners.map((logo, index) => (
                  <img
                    key={`${logo}-${index}`}
                    src={logo}
                    alt={`${t("trust.partnerAlt")} ${index + 1}`}
                    className="h-10 w-auto object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition snap-center"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustStrip;
