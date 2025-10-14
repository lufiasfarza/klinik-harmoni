import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Award, GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiService, Doctor as ApiDoctor } from "@/services/api";
import { toast } from "sonner";

// Import doctor photos
import doctorSarah from "@/assets/doctor-sarah.jpg";
import doctorAhmad from "@/assets/doctor-ahmad.jpg";
import doctorMei from "@/assets/doctor-mei.jpg";
import doctorRaj from "@/assets/doctor-raj.jpg";
import doctorLisa from "@/assets/doctor-lisa.jpg";
import doctorDaniel from "@/assets/doctor-daniel.jpg";
import doctorAminah from "@/assets/doctor-aminah.jpg";
import doctorWong from "@/assets/doctor-wong.jpg";
import doctorPriya from "@/assets/doctor-priya.jpg";
import doctorFarid from "@/assets/doctor-farid.jpg";
import doctorCatherine from "@/assets/doctor-catherine.jpg";
import doctorMarcus from "@/assets/doctor-marcus.jpg";

interface DoctorDetails extends ApiDoctor {
  role?: string;
  image: string;
  branch: string;
  schedule: string;
  bio: string;
  experience?: string;
  education?: string[];
  certifications?: string[];
  languages?: string[];
}

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctor data from API
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setError('Doctor ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching doctor with ID:', id);
        const response = await apiService.getDoctor(id);
        console.log('Doctor API Response:', response);
        
        if (response.success && response.data) {
          // Map doctor photos
          const doctorPhotos = [
            doctorSarah, doctorAhmad, doctorMei, doctorRaj, doctorLisa,
            doctorDaniel, doctorCatherine, doctorMarcus, doctorPriya, doctorFarid
          ];
          
          const roles = [
            "Medical Director", "Senior General Practitioner", "Consultant Physician",
            "Specialist Doctor", "Family Medicine Doctor", "Internal Medicine Specialist",
            "Pediatric Specialist", "Orthopedic Specialist", "Cardiology Specialist", "General Practitioner"
          ];

          const doctorDetails: DoctorDetails = {
            ...response.data,
            role: roles[response.data.id % roles.length],
            image: doctorPhotos[response.data.id % doctorPhotos.length],
            branch: response.data.branch?.name || 'Klinik Harmoni',
            schedule: response.data.schedule || "Mon-Fri: 9:00 AM - 5:00 PM",
            bio: response.data.bio || "Experienced healthcare professional dedicated to patient care.",
            experience: "10+ years", // Default experience
            education: [
              "MBBS - University of Malaya",
              "Master of Medicine - Universiti Kebangsaan Malaysia"
            ],
            certifications: [
              "Fellow, Malaysian Medical Association",
              "Certified Healthcare Professional"
            ],
            languages: ["English", "Bahasa Malaysia"]
          };
          
          console.log('Transformed doctor:', doctorDetails);
          setDoctor(doctorDetails);
        } else {
          console.error('Doctor API Error:', response);
          setError('Doctor not found');
          toast.error('Doctor not found');
        }
      } catch (err) {
        console.error('Doctor Network Error:', err);
        setError('Network error');
        toast.error('Network error while loading doctor');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold mb-4">Loading Doctor Profile...</h1>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Doctor Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested doctor could not be found.'}</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24 shadow-card">
              <div className="text-center mb-6">
                <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {doctor.name}
                </h1>
                <Badge className="mb-2">{doctor.role}</Badge>
                <p className="text-muted-foreground">{doctor.specialization}</p>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">{doctor.branch}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Schedule</p>
                    <p className="text-sm text-muted-foreground">{doctor.schedule}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Experience</p>
                    <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" onClick={() => navigate("/#booking")}>
                Book Appointment
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-8 shadow-card">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
            </Card>

            <Card className="p-8 shadow-card">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Education
              </h2>
              <ul className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-muted-foreground">{edu}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 shadow-card">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Certifications
              </h2>
              <ul className="space-y-2">
                {doctor.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-muted-foreground">{cert}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 shadow-card">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="px-4 py-1.5">
                    {lang}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
