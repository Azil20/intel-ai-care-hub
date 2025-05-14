
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentBooking from "./AppointmentBooking";
import AiChatAssistant from "./AiChatAssistant";
import { Calendar, MessageCircle, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Mock patient data
  const patientData = {
    name: user?.name || "Patient",
    avatar: "/profile-placeholder.png",
    upcomingAppointments: [
      { 
        id: "1", 
        doctorName: isArabic ? "د. سارة سميث" : "Dr. Sarah Smith", 
        doctorAvatar: "/profile-placeholder.png",
        date: "2025-05-20", 
        time: "10:00 AM", 
        reason: isArabic ? "فحص منتظم" : "Regular Checkup" 
      },
      { 
        id: "2", 
        doctorName: isArabic ? "د. روبرت جونسون" : "Dr. Robert Johnson", 
        doctorAvatar: "/profile-placeholder.png",
        date: "2025-05-25", 
        time: "2:30 PM", 
        reason: isArabic ? "متابعة" : "Follow-up" 
      },
    ],
    recentPrescriptions: [
      { id: "1", medication: isArabic ? "أموكسيسيلين" : "Amoxicillin", dosage: "500mg", frequency: isArabic ? "3 مرات يوميًا" : "3x daily", date: "2025-05-01" },
      { id: "2", medication: isArabic ? "إيبوبروفين" : "Ibuprofen", dosage: "400mg", frequency: isArabic ? "عند الحاجة" : "As needed", date: "2025-05-01" },
    ]
  };

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
                    {patientData.upcomingAppointments.length > 0 ? (
                      <ul className="space-y-3">
                        {patientData.upcomingAppointments.map(appointment => (
                          <li key={appointment.id} className="p-3 rounded-md border">
                            <div className={`flex items-center gap-2 font-medium ${isArabic ? "flex-row-reverse justify-end" : ""}`}>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                                <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={isArabic ? "text-right" : ""}>
                                {appointment.doctorName}
                              </div>
                            </div>
                            <div className={`text-sm text-gray-500 ${isArabic ? "text-right" : ""}`}>
                              {new Date(appointment.date).toLocaleDateString(isArabic ? 'ar-SA' : undefined)} {isArabic ? "الساعة" : "at"} {appointment.time}
                            </div>
                            <div className={`text-sm ${isArabic ? "text-right" : ""}`}>{appointment.reason}</div>
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
                    {patientData.recentPrescriptions.length > 0 ? (
                      <ul className="space-y-3">
                        {patientData.recentPrescriptions.map(prescription => (
                          <li key={prescription.id} className="p-3 rounded-md border">
                            <div className={`font-medium ${isArabic ? "text-right" : ""}`}>{prescription.medication}</div>
                            <div className={`text-sm ${isArabic ? "text-right" : ""}`}>
                              {prescription.dosage}, {prescription.frequency}
                            </div>
                            <div className={`text-sm text-gray-500 ${isArabic ? "text-right" : ""}`}>
                              {isArabic ? "وصفت في" : "Prescribed on"} {new Date(prescription.date).toLocaleDateString(isArabic ? 'ar-SA' : undefined)}
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
