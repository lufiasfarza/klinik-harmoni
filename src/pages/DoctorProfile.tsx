import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Award, GraduationCap, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

interface DoctorDetails {
  id: string;
  name: string;
  role: string;
  specialization: string;
  image: string;
  branch: string;
  schedule: string;
  bio: string;
  experience: string;
  education: string[];
  certifications: string[];
  languages: string[];
}

const doctorsDatabase: Record<string, DoctorDetails> = {
  "sarah-lim": {
    id: "sarah-lim",
    name: "Dr. Sarah Lim",
    role: "Medical Director",
    specialization: "General Practice & Family Medicine",
    image: doctorSarah,
    branch: "KL Central",
    schedule: "Mon-Sat: 9:00 AM - 8:00 PM",
    bio: "Dr. Sarah Lim is a highly experienced general practitioner with over 15 years of experience in family medicine. She is passionate about preventive care and patient education, ensuring her patients receive comprehensive healthcare tailored to their needs.",
    experience: "15+ years",
    education: [
      "MBBS - University of Malaya",
      "Master of Family Medicine - Universiti Kebangsaan Malaysia"
    ],
    certifications: [
      "Fellow, Academy of Family Physicians of Malaysia",
      "Certified in Aesthetic Medicine"
    ],
    languages: ["English", "Bahasa Malaysia", "Mandarin", "Cantonese"]
  },
  "ahmad-razak": {
    id: "ahmad-razak",
    name: "Dr. Ahmad Razak",
    role: "Senior General Practitioner",
    specialization: "Internal Medicine",
    image: doctorAhmad,
    branch: "Petaling Jaya",
    schedule: "Mon-Sat: 9:00 AM - 8:00 PM",
    bio: "Dr. Ahmad Razak specializes in internal medicine with a focus on chronic disease management. His approach emphasizes holistic care and building long-term relationships with patients.",
    experience: "12+ years",
    education: [
      "MBBS - International Islamic University Malaysia",
      "Postgraduate Diploma in Internal Medicine"
    ],
    certifications: [
      "Member, Malaysian Medical Association",
      "Certified Diabetes Educator"
    ],
    languages: ["English", "Bahasa Malaysia"]
  },
  "mei-chen": {
    id: "mei-chen",
    name: "Dr. Mei Chen",
    role: "Consultant Physician",
    specialization: "Women's Health & Pediatrics",
    image: doctorMei,
    branch: "Bangsar",
    schedule: "Mon-Fri: 10:00 AM - 7:00 PM",
    bio: "Dr. Mei Chen is dedicated to women's health and pediatric care. With her gentle approach and extensive experience, she provides compassionate care for mothers and children.",
    experience: "10+ years",
    education: [
      "MBBS - National University of Singapore",
      "Master in Obstetrics & Gynaecology"
    ],
    certifications: [
      "Fellow, Royal College of Obstetricians and Gynaecologists",
      "Certified Lactation Consultant"
    ],
    languages: ["English", "Mandarin", "Bahasa Malaysia"]
  }
};

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const doctor = id ? doctorsDatabase[id] : null;

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Doctor Not Found</h1>
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
