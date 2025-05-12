
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import PatientList from "./PatientList";
import AppointmentCalendar from "./AppointmentCalendar";
import { Calendar, User } from "lucide-react";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for doctor dashboard
  const dashboardData = {
    totalPatients: 42,
    appointmentsToday: 8,
    appointmentsTomorrow: 6,
    recentPatients: [
      { id: "p1", name: "John Doe", age: 45, lastVisit: "2025-05-01", condition: "Hypertension" },
      { id: "p2", name: "Jane Smith", age: 35, lastVisit: "2025-05-05", condition: "Diabetes Type 2" },
      { id: "p3", name: "Robert Johnson", age: 52, lastVisit: "2025-05-08", condition: "Arthritis" },
    ]
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Patients
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Appointments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{dashboardData.totalPatients}</CardTitle>
                <CardDescription>Total Patients</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{dashboardData.appointmentsToday}</CardTitle>
                <CardDescription>Appointments Today</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{dashboardData.appointmentsTomorrow}</CardTitle>
                <CardDescription>Appointments Tomorrow</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Your recently seen patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Age</th>
                      <th className="text-left py-3 px-2">Last Visit</th>
                      <th className="text-left py-3 px-2">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentPatients.map((patient) => (
                      <tr key={patient.id} className="border-b hover:bg-muted/50 cursor-pointer">
                        <td className="py-3 px-2 font-medium">{patient.name}</td>
                        <td className="py-3 px-2">{patient.age}</td>
                        <td className="py-3 px-2">{new Date(patient.lastVisit).toLocaleDateString()}</td>
                        <td className="py-3 px-2">{patient.condition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-200 ml-3">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -left-3 ring-8 ring-white">
                    <span className="text-teal-500 text-sm">9AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">John Doe</h3>
                  <p className="mb-2 text-sm text-gray-500">Regular Checkup - Blood Pressure Monitoring</p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -left-3 ring-8 ring-white">
                    <span className="text-teal-500 text-sm">10AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">Sarah Johnson</h3>
                  <p className="mb-2 text-sm text-gray-500">Follow-up - Post Surgery</p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -left-3 ring-8 ring-white">
                    <span className="text-teal-500 text-sm">11AM</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">Robert Brown</h3>
                  <p className="mb-2 text-sm text-gray-500">New Patient - Initial Consultation</p>
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
