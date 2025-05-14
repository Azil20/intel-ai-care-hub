
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import PatientList from "./PatientList";
import AppointmentCalendar from "./AppointmentCalendar";
import { Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Mock data for doctor dashboard with Arabic names
  const dashboardData = {
    totalPatients: 42,
    appointmentsToday: 8,
    appointmentsTomorrow: 6,
    recentPatients: [
      { id: "p1", name: isArabic ? "محمد أحمد" : "Mohammed Ahmed", age: 45, lastVisit: "2025-05-01", condition: isArabic ? "ارتفاع ضغط الدم" : "Hypertension", avatar: "/profile-placeholder.png" },
      { id: "p2", name: isArabic ? "فاطمة علي" : "Fatima Ali", age: 35, lastVisit: "2025-05-05", condition: isArabic ? "السكري النوع 2" : "Diabetes Type 2", avatar: "/profile-placeholder.png" },
      { id: "p3", name: isArabic ? "عبدالله محمود" : "Abdullah Mahmoud", age: 52, lastVisit: "2025-05-08", condition: isArabic ? "التهاب المفاصل" : "Arthritis", avatar: "/profile-placeholder.png" },
    ]
  };

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
                <CardTitle className="text-2xl">{dashboardData.totalPatients}</CardTitle>
                <CardDescription>{isArabic ? "إجمالي المرضى" : "Total Patients"}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{dashboardData.appointmentsToday}</CardTitle>
                <CardDescription>{isArabic ? "مواعيد اليوم" : "Appointments Today"}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{dashboardData.appointmentsTomorrow}</CardTitle>
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
                    {dashboardData.recentPatients.map((patient) => (
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
                        <td className={`py-3 px-2 ${isArabic ? "text-right" : ""}`}>{new Date(patient.lastVisit).toLocaleDateString(isArabic ? 'ar-SA' : undefined)}</td>
                        <td className={`py-3 px-2 ${isArabic ? "text-right" : ""}`}>{patient.condition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? "جدول اليوم" : "Today's Schedule"}</CardTitle>
              <CardDescription>{isArabic ? "مواعيدك لهذا اليوم" : "Your appointments for today"}</CardDescription>
            </CardHeader>
            <CardContent className={isArabic ? "text-right" : ""}>
              <ol className={`relative border-l border-gray-200 ${isArabic ? "mr-3 border-r border-l-0" : "ml-3"}`}>
                <li className={`mb-6 ${isArabic ? "mr-6" : "ml-6"}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full ${isArabic ? "-right-3" : "-left-3"} ring-8 ring-white`}>
                    <span className="text-teal-500 text-sm">9AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">{isArabic ? "محمد أحمد" : "Mohammed Ahmed"}</h3>
                  <p className="mb-2 text-sm text-gray-500">{isArabic ? "فحص منتظم - مراقبة ضغط الدم" : "Regular Checkup - Blood Pressure Monitoring"}</p>
                </li>
                <li className={`mb-6 ${isArabic ? "mr-6" : "ml-6"}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full ${isArabic ? "-right-3" : "-left-3"} ring-8 ring-white`}>
                    <span className="text-teal-500 text-sm">10AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">{isArabic ? "سارة عبدالله" : "Sarah Abdullah"}</h3>
                  <p className="mb-2 text-sm text-gray-500">{isArabic ? "متابعة - ما بعد الجراحة" : "Follow-up - Post Surgery"}</p>
                </li>
                <li className={`mb-6 ${isArabic ? "mr-6" : "ml-6"}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full ${isArabic ? "-right-3" : "-left-3"} ring-8 ring-white`}>
                    <span className="text-teal-500 text-sm">11AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">{isArabic ? "خالد محمد" : "Khalid Mohammed"}</h3>
                  <p className="mb-2 text-sm text-gray-500">{isArabic ? "مريض جديد - استشارة أولية" : "New Patient - Initial Consultation"}</p>
                </li>
              </ol>
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
