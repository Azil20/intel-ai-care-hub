import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import PatientList from "./PatientList";
import AppointmentCalendar from "./AppointmentCalendar";
import { Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiService, type Appointment, type User as UserType } from "@/services/apiService";
import { format, parseISO, isToday, isTomorrow } from "date-fns";

interface Patient {
  id: string;
  name: string;
  email: string;
  age?: number;
  lastVisit?: string;
  condition?: string;
  avatar?: string;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching appointments for doctor:", user.id);
        
        // Get appointments for this doctor
        const appointmentsResponse = await apiService.getAppointments(user.id, 'doctor');
        if (appointmentsResponse.success && appointmentsResponse.data) {
          console.log("Found doctor appointments:", appointmentsResponse.data);
          setAppointments(appointmentsResponse.data);
          
          // Get unique patient IDs who have appointments with this doctor
          const patientIds = [...new Set(appointmentsResponse.data.map(apt => apt.patient_id))];
          console.log("Patient IDs with appointments:", patientIds);
          
          if (patientIds.length > 0) {
            // Create patient data with appointment history
            const patientsWithData = await Promise.all(
              patientIds.map(async (patientId) => {
                try {
                  const userResponse = await apiService.getUserById(patientId);
                  if (userResponse.success && userResponse.data) {
                    const patient = userResponse.data;
                    const patientAppointments = appointmentsResponse.data.filter(apt => apt.patient_id === patientId);
                    const lastAppointment = patientAppointments
                      .filter(apt => apt.status === 'completed')
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                    
                    return {
                      id: patient.id,
                      name: patient.name,
                      email: patient.email,
                      age: Math.floor(Math.random() * 40) + 25, // Mock age for now
                      lastVisit: lastAppointment?.date,
                      condition: lastAppointment?.reason || (isArabic ? "لا توجد معلومات" : "No information"),
                      avatar: patient.avatar || "/profile-placeholder.png"
                    };
                  }
                  return null;
                } catch (error) {
                  console.error(`Error fetching patient ${patientId}:`, error);
                  return null;
                }
              })
            );
            
            const validPatients = patientsWithData.filter(Boolean) as Patient[];
            console.log("Patients with appointments:", validPatients);
            setPatients(validPatients);
          }
        } else {
          console.error("Error fetching appointments:", appointmentsResponse.error);
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user, isArabic]);

  // Calculate dashboard statistics
  const totalPatients = patients.length;
  const appointmentsToday = appointments.filter(apt => 
    isToday(parseISO(apt.date)) && apt.status === 'scheduled'
  ).length;
  const appointmentsTomorrow = appointments.filter(apt => 
    isTomorrow(parseISO(apt.date)) && apt.status === 'scheduled'
  ).length;

  // Get recent patients (patients with recent appointments)
  const recentPatients = patients
    .filter(patient => patient.lastVisit)
    .sort((a, b) => {
      if (!a.lastVisit || !b.lastVisit) return 0;
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    })
    .slice(0, 3);

  // Get today's appointments for schedule
  const todaysAppointments = appointments
    .filter(apt => isToday(parseISO(apt.date)) && apt.status === 'scheduled')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className={`text-3xl font-bold mb-8 ${isArabic ? "text-right font-arabic" : ""}`}>
        {isArabic ? "لوحة تحكم الطبيب" : "Doctor Dashboard"}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{isArabic ? "نظرة عامة" : "Overview"}</TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <User className="h-4 w-4" /> {isArabic ? "المرضى" : "Patients"}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {isArabic ? "المواعيد" : "Appointments"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{totalPatients}</CardTitle>
                <CardDescription>{isArabic ? "إجمالي المرضى" : "Total Patients"}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{appointmentsToday}</CardTitle>
                <CardDescription>{isArabic ? "مواعيد اليوم" : "Appointments Today"}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{appointmentsTomorrow}</CardTitle>
                <CardDescription>{isArabic ? "مواعيد الغد" : "Appointments Tomorrow"}</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? "المرضى الأخيرون" : "Recent Patients"}</CardTitle>
              <CardDescription>{isArabic ? "مرضاك الذين تمت مشاهدتهم مؤخرًا" : "Your recently seen patients"}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className={`text-left py-3 px-2 ${isArabic ? "text-right" : ""}`}>{isArabic ? "الاسم" : "Name"}</th>
                        <th className={`text-left py-3 px-2 ${isArabic ? "text-right" : ""}`}>{isArabic ? "العمر" : "Age"}</th>
                        <th className={`text-left py-3 px-2 ${isArabic ? "text-right" : ""}`}>{isArabic ? "آخر زيارة" : "Last Visit"}</th>
                        <th className={`text-left py-3 px-2 ${isArabic ? "text-right" : ""}`}>{isArabic ? "الحالة" : "Condition"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-muted/50 cursor-pointer">
                          <td className={`py-3 px-2 font-medium ${isArabic ? "text-right" : ""}`}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{patient.name}</span>
                            </div>
                          </td>
                          <td className={`py-3 px-2 ${isArabic ? "text-right" : ""}`}>{patient.age}</td>
                          <td className={`py-3 px-2 ${isArabic ? "text-right" : ""}`}>
                            {patient.lastVisit ? format(parseISO(patient.lastVisit), "PPP") : "N/A"}
                          </td>
                          <td className={`py-3 px-2 ${isArabic ? "text-right" : ""}`}>{patient.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={`text-muted-foreground ${isArabic ? "text-right" : ""}`}>
                  {isArabic ? "لا توجد مواعيد حديثة" : "No recent patient visits"}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? "جدول اليوم" : "Today's Schedule"}</CardTitle>
              <CardDescription>{isArabic ? "مواعيدك لهذا اليوم" : "Your appointments for today"}</CardDescription>
            </CardHeader>
            <CardContent className={isArabic ? "text-right" : ""}>
              {todaysAppointments.length > 0 ? (
                <ol className={`relative border-l border-gray-200 ${isArabic ? "mr-3 border-r border-l-0" : "ml-3"}`}>
                  {todaysAppointments.map((appointment) => (
                    <li key={appointment.id} className={`mb-6 ${isArabic ? "mr-6" : "ml-6"}`}>
                      <span className={`absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full ${isArabic ? "-right-3" : "-left-3"} ring-8 ring-white`}>
                        <span className="text-teal-500 text-xs">{appointment.time}</span>
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold">{appointment.patient_name}</h3>
                      <p className="mb-2 text-sm text-gray-500">{appointment.reason || (isArabic ? "لا يوجد سبب محدد" : "No reason provided")}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={`text-muted-foreground ${isArabic ? "text-right" : ""}`}>
                  {isArabic ? "لا توجد مواعيد اليوم" : "No appointments scheduled for today"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients">
          <PatientList />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
