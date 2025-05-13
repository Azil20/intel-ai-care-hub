
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAppointments } from "@/services/localDatabase";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();
  
  // Load appointments from database
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        const allAppointments = await getAllAppointments();
        
        // Filter appointments for this doctor
        const doctorAppointments = allAppointments.filter(
          (app) => app.doctorId === user.id
        );
        
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);
  
  // Convert string dates to Date objects for comparison
  const appointmentsWithDates = appointments.map(appointment => ({
    ...appointment,
    dateObj: parseISO(`${appointment.date}T${appointment.time}:00`)
  }));
  
  // Get appointments for selected date
  const selectedDateAppointments = appointmentsWithDates.filter(appointment => 
    selectedDate && isSameDay(appointment.dateObj, selectedDate)
  );
  
  // Create a map of dates with appointments
  const appointmentDates = appointmentsWithDates.reduce((acc, appointment) => {
    const dateKey = format(appointment.dateObj, "yyyy-MM-dd");
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
                    <h3 className="font-medium">{appointment.patientName || `Patient ID: ${appointment.patientId.slice(0, 6)}`}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    <p className="text-xs mt-1 text-muted-foreground">Status: {appointment.status}</p>
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
