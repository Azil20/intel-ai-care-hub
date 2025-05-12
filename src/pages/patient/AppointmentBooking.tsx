
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AppointmentBooking: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  // Mock data
  const doctors = [
    { id: "1", name: "Dr. Sarah Smith", specialty: "General Practitioner" },
    { id: "2", name: "Dr. Robert Johnson", specialty: "Cardiologist" },
    { id: "3", name: "Dr. Emily Williams", specialty: "Dermatologist" },
    { id: "4", name: "Dr. Michael Brown", specialty: "Neurologist" },
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !doctor || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send data to a server
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment has been booked for ${format(date, "PPP")} at ${time}`,
    });

    // Reset form
    setDate(undefined);
    setDoctor("");
    setTime("");
    setReason("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Schedule a visit with one of our healthcare professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={doctor} onValueChange={setDoctor}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      const now = new Date();
                      const yesterday = new Date(now);
                      yesterday.setDate(now.getDate() - 1);
                      return date < yesterday || date.getDay() === 0 || date.getDay() === 6;
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time" className="w-full">
                  <div className="flex items-center">
                    {time ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </>
                    ) : (
                      <span>Select a time slot</span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Please briefly describe the reason for your appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-hospital-500 hover:bg-hospital-600">
            Book Appointment
          </Button>
        </form>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Important Information:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Appointments can be scheduled Monday through Friday</li>
            <li>Please arrive 15 minutes before your scheduled time</li>
            <li>Bring your identification and any relevant medical records</li>
            <li>You can cancel or reschedule up to 24 hours before your appointment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
