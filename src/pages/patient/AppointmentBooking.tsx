
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  name: string;
  email: string;
  role: 'doctor';
  phone_number?: string;
  avatar?: string;
}

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Fetching doctors for appointment booking");
        
        const { data: doctorUsers, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'doctor');

        if (error) {
          console.error("Error fetching doctors:", error);
          return;
        }

        console.log("Found doctors:", doctorUsers);
        setDoctors(doctorUsers || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get user and doctor names
      const { data: userData } = await supabase
        .from('users')
        .select('name, phone_number')
        .eq('id', user.id)
        .single();

      const { data: doctorData } = await supabase
        .from('users')
        .select('name')
        .eq('id', selectedDoctor)
        .single();

      console.log("Creating appointment with data:", {
        patient_id: user.id,
        patient_name: userData?.name || 'Unknown Patient',
        patient_phone_number: userData?.phone_number,
        doctor_id: selectedDoctor,
        doctor_name: doctorData?.name || 'Unknown Doctor',
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        reason,
        status: "scheduled",
      });

      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          patient_name: userData?.name || 'Unknown Patient',
          patient_phone_number: userData?.phone_number,
          doctor_id: selectedDoctor,
          doctor_name: doctorData?.name || 'Unknown Doctor',
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          reason,
          status: "scheduled",
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Appointment created successfully:", appointment);

      toast({
        title: "Success",
        description: "Appointment booked successfully! You can view it in your overview.",
      });

      // Reset form
      setSelectedDoctor(undefined);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setReason("");

      // Trigger a custom event to refresh the parent dashboard
      window.dispatchEvent(new CustomEvent('appointmentBooked'));
      
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Schedule your appointment with ease
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Appointment</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-hospital-500 hover:bg-hospital-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
