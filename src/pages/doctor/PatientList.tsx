
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  contact: string;
  lastVisit: string;
}

const PatientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Mock patient data
  const patients: Patient[] = [
    { id: "p1", name: "John Doe", age: 45, gender: "Male", condition: "Hypertension", contact: "555-123-4567", lastVisit: "2025-05-01" },
    { id: "p2", name: "Jane Smith", age: 35, gender: "Female", condition: "Diabetes Type 2", contact: "555-234-5678", lastVisit: "2025-05-05" },
    { id: "p3", name: "Robert Johnson", age: 52, gender: "Male", condition: "Arthritis", contact: "555-345-6789", lastVisit: "2025-05-08" },
    { id: "p4", name: "Emily Wilson", age: 28, gender: "Female", condition: "Asthma", contact: "555-456-7890", lastVisit: "2025-05-10" },
    { id: "p5", name: "Michael Brown", age: 41, gender: "Male", condition: "Allergies", contact: "555-567-8901", lastVisit: "2025-05-12" },
    { id: "p6", name: "Sarah Taylor", age: 63, gender: "Female", condition: "Osteoporosis", contact: "555-678-9012", lastVisit: "2025-05-15" },
    { id: "p7", name: "David Miller", age: 37, gender: "Male", condition: "Anxiety", contact: "555-789-0123", lastVisit: "2025-05-18" },
    { id: "p8", name: "Lisa Anderson", age: 49, gender: "Female", condition: "Migraines", contact: "555-890-1234", lastVisit: "2025-05-20" },
  ];
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Manage and view your patients' information</CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or condition..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} onClick={() => handlePatientClick(patient)} className="cursor-pointer">
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.contact}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePatientClick(patient);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
            <DialogDescription>Details for {selectedPatient?.name}</DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p>{selectedPatient.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Age</h3>
                  <p>{selectedPatient.age} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p>{selectedPatient.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p>{selectedPatient.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical Condition</h3>
                  <p>{selectedPatient.condition}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
                  <p>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Appointments</h3>
                <div className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500">Regular Checkup</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>{new Date(new Date(selectedPatient.lastVisit).getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500">Follow-up</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full bg-hospital-500 hover:bg-hospital-600">
                  Patient Records
                </Button>
                <Button className="w-full bg-teal-500 hover:bg-teal-600">
                  Schedule Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientList;
