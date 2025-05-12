
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentBooking from "./AppointmentBooking";
import AiChatAssistant from "./AiChatAssistant";
import { Calendar, MessageCircle, User } from "lucide-react";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const patientData = {
    name: user?.name || "Patient",
    upcomingAppointments: [
      { id: "1", doctorName: "Dr. Sarah Smith", date: "2025-05-20", time: "10:00 AM", reason: "Regular Checkup" },
      { id: "2", doctorName: "Dr. Robert Johnson", date: "2025-05-25", time: "2:30 PM", reason: "Follow-up" },
    ],
    recentPrescriptions: [
      { id: "1", medication: "Amoxicillin", dosage: "500mg", frequency: "3x daily", date: "2025-05-01" },
      { id: "2", medication: "Ibuprofen", dosage: "400mg", frequency: "As needed", date: "2025-05-01" },
    ]
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Appointments
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Health Assistant
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {patientData.name}</CardTitle>
              <CardDescription>Here's a summary of your health information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patientData.upcomingAppointments.length > 0 ? (
                      <ul className="space-y-3">
                        {patientData.upcomingAppointments.map(appointment => (
                          <li key={appointment.id} className="p-3 rounded-md border">
                            <div className="font-medium">{appointment.doctorName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </div>
                            <div className="text-sm">{appointment.reason}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No upcoming appointments</p>
                    )}
                    <Button 
                      className="w-full mt-4 bg-hospital-500 hover:bg-hospital-600"
                      onClick={() => setActiveTab("appointments")}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patientData.recentPrescriptions.length > 0 ? (
                      <ul className="space-y-3">
                        {patientData.recentPrescriptions.map(prescription => (
                          <li key={prescription.id} className="p-3 rounded-md border">
                            <div className="font-medium">{prescription.medication}</div>
                            <div className="text-sm">
                              {prescription.dosage}, {prescription.frequency}
                            </div>
                            <div className="text-sm text-gray-500">
                              Prescribed on {new Date(prescription.date).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No recent prescriptions</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Health Assistant</CardTitle>
                  <CardDescription>Ask questions about your health</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Need quick answers to your health questions? Try our AI health assistant.</p>
                  <Button
                    className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => setActiveTab("ai-assistant")}
                  >
                    Chat with Health Assistant
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
