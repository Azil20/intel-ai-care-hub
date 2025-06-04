
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAppointmentsByDoctorId, getUsers } from "@/services/localDatabase";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  lastVisit?: string;
  appointmentCount: number;
  upcomingAppointments: number;
}

const PatientList: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || user.role !== 'doctor') return;
      
      try {
        setLoading(true);
        
        // Get appointments for this doctor
        const doctorAppointments = getAppointmentsByDoctorId(user.id);
        
        // Get all users
        const allUsers = getUsers();
        
        // Get unique patient IDs who have appointments with this doctor
        const patientIdsWithAppointments = [...new Set(doctorAppointments.map(apt => apt.patientId))];
        
        // Filter only patients who have appointments with this doctor
        const patientsWithAppointments = allUsers.filter(u => 
          u.role === 'patient' && patientIdsWithAppointments.includes(u.id)
        );
        
        // Create patient data with appointment statistics
        const patientsData = patientsWithAppointments.map(patient => {
          const patientAppointments = doctorAppointments.filter(apt => apt.patientId === patient.id);
          const lastCompletedAppointment = patientAppointments
            .filter(apt => apt.status === 'completed')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          const upcomingAppointments = patientAppointments.filter(
            apt => apt.status === 'scheduled' && new Date(apt.date) >= new Date()
          ).length;
          
          return {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            avatar: patient.avatar || "/profile-placeholder.png",
            lastVisit: lastCompletedAppointment?.date,
            appointmentCount: patientAppointments.length,
            upcomingAppointments
          };
        });
        
        setPatients(patientsData);
        setFilteredPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isArabic ? "text-right" : ""}`}>
          {isArabic ? "قائمة المرضى" : "Patient List"}
        </h2>
        <div className="relative w-64">
          <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${isArabic ? "right-3" : "left-3"}`} />
          <Input
            placeholder={isArabic ? "البحث عن المرضى..." : "Search patients..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={isArabic ? "pr-10 text-right" : "pl-10"}
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className={`text-muted-foreground ${isArabic ? "text-right" : ""}`}>
                {searchTerm ? 
                  (isArabic ? "لم يتم العثور على مرضى" : "No patients found") :
                  (isArabic ? "لا يوجد مرضى مع مواعيد" : "No patients with appointments")
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={isArabic ? "text-right" : ""}>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span>{patient.email}</span>
                      </div>
                      {patient.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phoneNumber}</span>
                        </div>
                      )}
                      {patient.lastVisit && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {isArabic ? "آخر زيارة: " : "Last visit: "}
                            {format(parseISO(patient.lastVisit), "PPP")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex flex-col gap-2 ${isArabic ? "items-start" : "items-end"}`}>
                    <Badge variant="outline">
                      {patient.appointmentCount} {isArabic ? "مواعيد" : "appointments"}
                    </Badge>
                    {patient.upcomingAppointments > 0 && (
                      <Badge variant="default">
                        {patient.upcomingAppointments} {isArabic ? "قادمة" : "upcoming"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
