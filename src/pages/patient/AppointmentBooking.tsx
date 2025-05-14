
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createAppointment, getUsers } from "@/services/localDatabase";
import { format } from "date-fns";
import { CalendarIcon, Clock, Phone, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const AppointmentBooking: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { language, t } = useLanguage();
  const isArabic = language === "ar";
  
  // Get doctors from the database
  const doctors = getUsers().filter(user => user.role === "doctor");

  // Available time slots
  const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !selectedDoctor || !phoneNumber) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date as YYYY-MM-DD
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Create appointment
      createAppointment({
        patientId: user?.id || "",
        patientPhoneNumber: phoneNumber,
        doctorId: selectedDoctor,
        date: formattedDate,
        time: selectedTime,
        reason: reason,
        status: "scheduled",
      });

      // Show success message
      toast({
        title: isArabic ? "تم الحجز بنجاح" : "Appointment Booked",
        description: isArabic 
          ? `تم تأكيد موعدك. سنرسل لك إشعارًا على ${phoneNumber} عندما يحين دورك.` 
          : `Your appointment has been confirmed. We'll notify you at ${phoneNumber} when it's your turn.`,
        variant: "default",
      });

      // Also use the popup toast for extra visibility
      toast.success(isArabic 
        ? `تم تأكيد موعدك. سنرسل لك إشعارًا على ${phoneNumber} عندما يحين دورك.` 
        : `Your appointment has been confirmed. We'll notify you at ${phoneNumber} when it's your turn.`
      );

      // Reset form
      setDate(undefined);
      setSelectedTime("");
      setSelectedDoctor("");
      setReason("");
    } catch (error) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "حدث خطأ أثناء حجز موعدك" : "An error occurred while booking your appointment",
        variant: "destructive",
      });
      console.error("Error booking appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className={isArabic ? "text-right font-arabic" : ""}>
            {t("bookAppointment")}
          </CardTitle>
          <CardDescription className={isArabic ? "text-right font-arabic" : ""}>
            {isArabic 
              ? "املأ التفاصيل أدناه لحجز موعد مع أحد أطبائنا" 
              : "Fill in the details below to book an appointment with one of our doctors"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className={isArabic ? "text-right block font-arabic" : ""}>
                {t("selectDoctor")} *
              </Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isArabic ? "اختر طبيبًا" : "Select a doctor"} />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{doctor.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className={isArabic ? "text-right block font-arabic" : ""}>
                {t("phoneNumber")} *
              </Label>
              <div className="flex gap-2">
                <Phone className="text-muted-foreground mt-2" />
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={isArabic ? "رقم الهاتف للإشعارات" : "Phone number for notifications"}
                  required
                  className={isArabic ? "text-right" : ""}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "سيتم استخدام رقم الهاتف لإرسال إشعار عندما يحين دورك"
                  : "Phone number will be used to send a notification when it's your turn"}
              </p>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date" className={isArabic ? "text-right block font-arabic" : ""}>
                {t("selectDate")} *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${date ? "" : "text-muted-foreground"} ${isArabic ? "flex-row-reverse" : ""}`}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "PPP") : (isArabic ? "اختر تاريخًا" : "Select a date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time" className={isArabic ? "text-right block font-arabic" : ""}>
                {t("selectTime")} *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isArabic ? "اختر وقتًا" : "Select a time"} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className={isArabic ? "text-right block font-arabic" : ""}>
                {t("reason")}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={isArabic ? "سبب الزيارة (اختياري)" : "Reason for visit (optional)"}
                className={isArabic ? "text-right" : ""}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-hospital-500 hover:bg-hospital-600"
              >
                {isArabic ? "تأكيد الموعد" : "Confirm Appointment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
