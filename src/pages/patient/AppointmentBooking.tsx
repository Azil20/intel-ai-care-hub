
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addAppointment, getUsersByRole } from "@/services/localDatabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Define appointment form values
interface AppointmentFormValues {
  doctorId: string;
  date: Date;
  time: string;
  reason: string;
}

const AppointmentBooking: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useLanguage();

  // Form setup with react-hook-form
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      doctorId: "",
      date: new Date(),
      time: "",
      reason: "",
    },
  });

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await getUsersByRole("doctor");
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description: language === "ar" 
            ? "فشل في تحميل قائمة الأطباء. يرجى المحاولة مرة أخرى."
            : "Failed to load doctors list. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchDoctors();
  }, [toast, language]);

  // Handle form submission
  const onSubmit = async (values: AppointmentFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Format date and time for appointment
      const formattedDate = format(values.date, "yyyy-MM-dd");
      
      // Create appointment object
      await addAppointment({
        patientId: user.id,
        doctorId: values.doctorId,
        date: formattedDate,
        time: values.time,
        reason: values.reason,
        status: "scheduled"
      });
      
      // Show success message
      toast({
        title: language === "ar" ? "تم الحجز" : "Appointment Booked",
        description: language === "ar"
          ? "تم حجز موعدك بنجاح"
          : "Your appointment has been scheduled successfully",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar"
          ? "فشل في حجز الموعد. يرجى المحاولة مرة أخرى."
          : "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Directions for RTL support
  const rtlClass = language === "ar" ? "rtl text-right" : "ltr text-left";

  return (
    <Card className={rtlClass}>
      <CardHeader>
        <CardTitle>{language === "ar" ? "حجز موعد" : "Book Appointment"}</CardTitle>
        <CardDescription>
          {language === "ar" 
            ? "حدد طبيبًا وتاريخًا ووقتًا لموعدك"
            : "Select a doctor, date, and time for your appointment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "ar" ? "الطبيب" : "Doctor"}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          language === "ar" ? "اختر طبيبًا" : "Select a doctor"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {language === "ar" ? "لا يوجد أطباء متاحون" : "No doctors available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{language === "ar" ? "التاريخ" : "Date"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, language === "ar" ? "dd/MM/yyyy" : "PPP")
                          ) : (
                            <span>{language === "ar" ? "اختر تاريخًا" : "Pick a date"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time Selection */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "ar" ? "الوقت" : "Time"}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          language === "ar" ? "اختر وقتًا" : "Select a time"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">01:00 PM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Reason for Visit */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "سبب الزيارة" : "Reason for Visit"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={
                        language === "ar" 
                          ? "يرجى وصف سبب الزيارة أو الأعراض التي تعاني منها"
                          : "Please describe the reason for your visit or symptoms you're experiencing"
                      }
                      {...field}
                      className={rtlClass}
                    />
                  </FormControl>
                  <FormDescription>
                    {language === "ar"
                      ? "سيساعد هذا طبيبك على التحضير لموعدك"
                      : "This will help your doctor prepare for your appointment"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-hospital-600 hover:bg-hospital-700"
            >
              {isSubmitting ? (
                language === "ar" ? "جارٍ الحجز..." : "Booking..."
              ) : (
                language === "ar" ? "تأكيد الموعد" : "Confirm Appointment"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
