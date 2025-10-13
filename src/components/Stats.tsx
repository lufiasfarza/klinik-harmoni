import { Users, Building2, Stethoscope, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Patients Served",
      color: "text-primary"
    },
    {
      icon: Building2,
      value: "13",
      label: "Clinic Branches",
      color: "text-secondary"
    },
    {
      icon: Stethoscope,
      value: "45+",
      label: "Medical Specialists",
      color: "text-primary"
    },
    {
      icon: Award,
      value: "15+",
      label: "Years Experience",
      color: "text-secondary"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all mb-4">
                  <Icon className={`h-8 w-8 md:h-10 md:w-10 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
