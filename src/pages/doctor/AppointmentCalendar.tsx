
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  reason: string;
  date: Date;
}

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  
  // Mock appointment data
  const appointments: Appointment[] = [
    { id: "a1", patientName: "John Doe", time: "9:00 AM", reason: "Regular Checkup", date: today },
    { id: "a2", patientName: "Sarah Johnson", time: "10:00 AM", reason: "Follow-up", date: today },
    { id: "a3", patientName: "Robert Brown", time: "11:00 AM", reason: "Initial Consultation", date: today },
    { id: "a4", patientName: "Michael Wilson", time: "2:00 PM", reason: "Vaccination", date: today },
    { id: "a5", patientName: "Emily Davis", time: "3:00 PM", reason: "Test Results", date: today },
    { id: "a6", patientName: "James Taylor", time: "4:00 PM", reason: "Prescription Renewal", date: today },
    {
      id: "a7",
      patientName: "Patricia Moore",
      time: "9:30 AM",
      reason: "Blood Test",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
    {
      id: "a8",
      patientName: "Richard Miller",
      time: "11:30 AM",
      reason: "Annual Physical",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
    {
      id: "a9",
      patientName: "Jennifer Anderson",
      time: "2:30 PM",
      reason: "Skin Condition",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  ];
  
  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter(appointment => 
    selectedDate && isSameDay(appointment.date, selectedDate)
  );
  
  // Create a map of dates with appointments
  const appointmentDates = appointments.reduce((acc, appointment) => {
    const dateKey = format(appointment.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey]++;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View and manage your appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-3 pointer-events-auto"
            modifiersClassNames={{
              today: "bg-muted",
            }}
            modifiers={{
              appointment: (date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                return !!appointmentDates[dateKey];
              },
            }}
            modifiersStyles={{
              appointment: {
                fontWeight: "bold",
                textDecoration: "underline",
                textDecorationColor: "hsl(var(--primary))",
                textDecorationThickness: "2px",
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              format(selectedDate, "PPPP")
            ) : (
              "No Date Selected"
            )}
          </CardTitle>
          <CardDescription>
            {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment) => (
                <div key={appointment.id} className="flex p-3 border rounded-md hover:bg-muted/50">
                  <div className="w-20 flex-shrink-0 text-center">
                    <Badge variant="outline" className="font-mono">
                      {appointment.time}
                    </Badge>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{appointment.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No appointments scheduled for this date
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
