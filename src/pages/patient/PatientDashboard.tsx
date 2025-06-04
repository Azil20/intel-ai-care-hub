
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentBooking from "./AppointmentBooking";
import AiChatAssistant from "./AiChatAssistant";
import { Calendar, MessageCircle, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAppointmentsByPatientId, getUsers } from "@/services/localDatabase";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoneNumber?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching appointments for patient:", user.id);
        
        // Get real appointments for this patient
        const patientAppointments = getAppointmentsByPatientId(user.id);
        console.log("Found appointments:", patientAppointments);
        
        // Filter for upcoming appointments (scheduled status and future dates)
        const upcomingAppointments = patientAppointments.filter(apt => {
          const appointmentDate = parseISO(apt.date);
          const today = new Date();
          return apt.status === 'scheduled' && appointmentDate >= today;
        });
        
        setAppointments(upcomingAppointments);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  // Refresh appointments when switching back to overview tab
  useEffect(() => {
    if (activeTab === "overview" && user) {
      const refreshAppointments = () => {
        console.log("Refreshing appointments for overview");
        const patientAppointments = getAppointmentsByPatientId(user.id);
        const upcomingAppointments = patientAppointments.filter(apt => {
          const appointmentDate = parseISO(apt.date);
          const today = new Date();
          return apt.status === 'scheduled' && appointmentDate >= today;
        });
        setAppointments(upcomingAppointments);
      };
      
      refreshAppointments();
    }
  }, [activeTab, user]);

  const patientData = {
    name: user?.name || "Patient",
    avatar: user?.avatar || "/profile-placeholder.png",
  };

  // Mock prescription data (this would come from a real prescription system)
  const recentPrescriptions = [
    { id: "1", medication: isArabic ? "أموكسيسيلين" : "Amoxicillin", dosage: "500mg", frequency: isArabic ? "3 مرات يوميًا" : "3x daily", date: "2025-05-01" },
    { id: "2", medication: isArabic ? "إيبوبروفين" : "Ibuprofen", dosage: "400mg", frequency: isArabic ? "عند الحاجة" : "As needed", date: "2025-05-01" },
  ];

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
      <div className={`flex items-center gap-4 mb-8 ${isArabic ? "flex-row-reverse" : ""}`}>
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={patientData.avatar} alt={patientData.name} />
          <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className={`text-3xl font-bold ${isArabic ? "font-arabic" : ""}`}>
          {isArabic ? "لوحة تحكم المريض" : "Patient Dashboard"}
        </h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" /> {isArabic ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {isArabic ? "المواعيد" : "Appointments"}
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> {isArabic ? "المساعد الصحي" : "Health Assistant"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={isArabic ? "text-right font-arabic" : ""}>
                {isArabic ? `مرحبًا، ${patientData.name}` : `Welcome, ${patientData.name}`}
              </CardTitle>
              <CardDescription className={isArabic ? "text-right font-arabic" : ""}>
                {isArabic ? "إليك ملخص لمعلوماتك الصحية" : "Here's a summary of your health information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-lg ${isArabic ? "text-right font-arabic" : ""}`}>
                      {isArabic ? "المواعيد القادمة" : "Upcoming Appointments"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <ul className="space-y-3">
                        {appointments.map(appointment => (
                          <li key={appointment.id} className="p-3 rounded-md border">
                            <div className={`flex items-center gap-2 font-medium ${isArabic ? "flex-row-reverse justify-end" : ""}`}>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={isArabic ? "text-right" : ""}>
                                {appointment.doctorName}
                              </div>
                            </div>
                            <div className={`text-sm text-gray-500 ${isArabic ? "text-right" : ""}`}>
                              {format(parseISO(appointment.date), "PPP")} {isArabic ? "الساعة" : "at"} {appointment.time}
                            </div>
                            <div className={`text-sm ${isArabic ? "text-right" : ""}`}>{appointment.reason || "No reason provided"}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-muted-foreground ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? "لا توجد مواعيد قادمة" : "No upcoming appointments"}
                      </p>
                    )}
                    <Button 
                      className="w-full mt-4 bg-hospital-500 hover:bg-hospital-600"
                      onClick={() => setActiveTab("appointments")}
                    >
                      {isArabic ? "حجز موعد" : "Book Appointment"}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-lg ${isArabic ? "text-right font-arabic" : ""}`}>
                      {isArabic ? "الوصفات الطبية الأخيرة" : "Recent Prescriptions"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentPrescriptions.length > 0 ? (
                      <ul className="space-y-3">
                        {recentPrescriptions.map(prescription => (
                          <li key={prescription.id} className="p-3 rounded-md border">
                            <div className={`font-medium ${isArabic ? "text-right" : ""}`}>{prescription.medication}</div>
                            <div className={`text-sm ${isArabic ? "text-right" : ""}`}>
                              {prescription.dosage}, {prescription.frequency}
                            </div>
                            <div className={`text-sm text-gray-500 ${isArabic ? "text-right" : ""}`}>
                              {isArabic ? "وصفت في" : "Prescribed on"} {format(parseISO(prescription.date), "PPP")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-muted-foreground ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? "لا توجد وصفات طبية حديثة" : "No recent prescriptions"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${isArabic ? "text-right font-arabic" : ""}`}>
                    {isArabic ? "المساعد الصحي" : "Health Assistant"}
                  </CardTitle>
                  <CardDescription className={isArabic ? "text-right font-arabic" : ""}>
                    {isArabic ? "اسأل أسئلة حول صحتك" : "Ask questions about your health"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${isArabic ? "text-right" : ""}`}>
                    {isArabic ? "هل تحتاج إلى إجابات سريعة لأسئلتك الصحية؟ جرب مساعدنا الصحي الذكي." : 
                     "Need quick answers to your health questions? Try our AI health assistant."}
                  </p>
                  <Button
                    className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => setActiveTab("ai-assistant")}
                  >
                    {isArabic ? "الدردشة مع المساعد الصحي" : "Chat with Health Assistant"}
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentBooking />
        </TabsContent>
        
        <TabsContent value="ai-assistant">
          <AiChatAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
