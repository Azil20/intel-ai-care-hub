import React, { useEffect, useState } from "react";
import { getAppointments } from "@/services/localDatabase";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO, isToday, isThisWeek, isThisMonth, isSameDay } from "date-fns";

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

interface DayViewProps {
  appointments: Appointment[];
  date: Date;
}

interface WeekViewProps {
  appointments: Appointment[];
  date: Date;
}

interface MonthViewProps {
  appointments: Appointment[];
  date: Date;
  onDateSelect: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ appointments, date }) => {
  // Filter appointments for the selected day
  const dayAppointments = appointments.filter(appointment => 
    isSameDay(parseISO(appointment.date), date)
  );

  // Sort appointments by time
  const sortedAppointments = [...dayAppointments].sort((a, b) => 
    a.time.localeCompare(b.time)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        Appointments for {format(date, "MMMM d, yyyy")}
      </h3>
      
      {sortedAppointments.length === 0 ? (
        <p className="text-muted-foreground">No appointments scheduled for this day.</p>
      ) : (
        <div className="space-y-3">
          {sortedAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.patientName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} • {appointment.reason || "No reason provided"}
                    </p>
                    {appointment.patientPhoneNumber && (
                      <p className="text-sm mt-1">📞 {appointment.patientPhoneNumber}</p>
                    )}
                  </div>
                  <Badge 
                    variant={
                      appointment.status === "completed" ? "outline" : 
                      appointment.status === "cancelled" ? "destructive" : 
                      "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const WeekView: React.FC<WeekViewProps> = ({ appointments, date }) => {
  // Filter appointments for the current week
  const weekAppointments = appointments.filter(appointment => 
    isThisWeek(parseISO(appointment.date), { weekStartsOn: 1 })
  );

  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  
  weekAppointments.forEach(appointment => {
    const dateKey = appointment.date;
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(appointment);
  });

  // Sort dates
  const sortedDates = Object.keys(appointmentsByDate).sort();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">This Week's Appointments</h3>
      
      {sortedDates.length === 0 ? (
        <p className="text-muted-foreground">No appointments scheduled for this week.</p>
      ) : (
        sortedDates.map(dateKey => (
          <div key={dateKey} className="space-y-3">
            <h4 className="font-medium">
              {format(parseISO(dateKey), "EEEE, MMMM d")}
              {isToday(parseISO(dateKey)) && " (Today)"}
            </h4>
            
            <div className="space-y-2">
              {appointmentsByDate[dateKey]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(appointment => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{appointment.patientName}</h5>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time} • {appointment.reason || "No reason provided"}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            appointment.status === "completed" ? "outline" : 
                            appointment.status === "cancelled" ? "destructive" : 
                            "default"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const MonthView: React.FC<MonthViewProps> = ({ appointments, date, onDateSelect }) => {
  // Filter appointments for the current month
  const monthAppointments = appointments.filter(appointment => 
    isThisMonth(parseISO(appointment.date))
  );

  // Get unique dates with appointments
  const datesWithAppointments = new Set(
    monthAppointments.map(appointment => appointment.date)
  );

  // Function to render appointment count for a day
  const renderAppointmentCount = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    if (datesWithAppointments.has(dateString)) {
      const count = monthAppointments.filter(
        appointment => appointment.date === dateString
      ).length;
      
      return (
        <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          {count}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {format(date, "MMMM yyyy")}
      </h3>
      
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && onDateSelect(newDate)}
        className="rounded-md border"
        components={{
          DayContent: (props) => (
            <div className="relative h-9 w-9 p-0 flex items-center justify-center">
              <span>{props.day.day}</span>
              {renderAppointmentCount(props.day.date)}
            </div>
          ),
        }}
      />
      
      <div className="space-y-3">
        <h4 className="font-medium">Upcoming Appointments</h4>
        
        {monthAppointments.length === 0 ? (
          <p className="text-muted-foreground">No appointments scheduled for this month.</p>
        ) : (
          monthAppointments
            .sort((a, b) => {
              // Sort by date first, then by time
              const dateComparison = a.date.localeCompare(b.date);
              if (dateComparison !== 0) return dateComparison;
              return a.time.localeCompare(b.time);
            })
            .slice(0, 5) // Show only the first 5 appointments
            .map(appointment => (
              <Card key={appointment.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{appointment.patientName}</h5>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(appointment.date), "MMM d")} at {appointment.time}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        appointment.status === "completed" ? "outline" : 
                        appointment.status === "cancelled" ? "destructive" : 
                        "default"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = getAppointments();
        
        // Filter appointments for the current doctor
        if (user && user.role === "doctor") {
          const doctorAppointments = appointments.filter(
            appointment => appointment.doctorId === user.id
          );
          setAppointments(doctorAppointments);
        } else {
          setAppointments(appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    
    fetchAppointments();
  }, [user]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
            <TabsList className="mb-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day">
              <DayView appointments={appointments} date={selectedDate} />
            </TabsContent>
            
            <TabsContent value="week">
              <WeekView appointments={appointments} date={selectedDate} />
            </TabsContent>
            
            <TabsContent value="month">
              <MonthView 
                appointments={appointments} 
                date={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
