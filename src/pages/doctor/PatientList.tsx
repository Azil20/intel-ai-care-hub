
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, type Appointment, type User } from "@/services/apiService";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
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
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get appointments for this doctor
        const appointmentsResponse = await apiService.getAppointments(user.id, 'doctor');
        if (!appointmentsResponse.success || !appointmentsResponse.data) {
          throw new Error(appointmentsResponse.error || 'Failed to fetch appointments');
        }

        const doctorAppointments = appointmentsResponse.data;
        
        // Get unique patient IDs who have appointments with this doctor
        const patientIdsWithAppointments = [...new Set(doctorAppointments.map(apt => apt.patient_id))];
        
        if (patientIdsWithAppointments.length > 0) {
          // Get patient data for each patient ID
          const patientsData = await Promise.all(
            patientIdsWithAppointments.map(async (patientId) => {
              try {
                const userResponse = await apiService.getUserById(patientId);
                if (userResponse.success && userResponse.data) {
                  const patient = userResponse.data;
                  const patientAppointments = doctorAppointments.filter(apt => apt.patient_id === patient.id);
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
                    phone_number: patient.phone_number,
                    avatar: patient.avatar || "/profile-placeholder.png",
                    lastVisit: lastCompletedAppointment?.date,
                    appointmentCount: patientAppointments.length,
                    upcomingAppointments
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching patient ${patientId}:`, error);
                return null;
              }
            })
          );
          
          const validPatients = patientsData.filter(Boolean) as Patient[];
          setPatients(validPatients);
          setFilteredPatients(validPatients);
        }
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
                      {patient.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone_number}</span>
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
