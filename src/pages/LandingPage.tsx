
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="header-gradient text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to IntelEJ Hospital</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Your health is our priority. Access your medical information and services securely and locally.
        </p>
      </div>

      <div className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Login Option</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-hospital-600 mb-4">Patient Portal</h3>
            <p className="text-gray-600 mb-6">
              Access your medical records, schedule appointments, and chat with our AI health assistant.
            </p>
            <Button 
              className="w-full bg-hospital-500 hover:bg-hospital-600"
              onClick={() => navigate("/login/patient")}
            >
              Patient Login
            </Button>
          </Card>

          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">Doctor Portal</h3>
            <p className="text-gray-600 mb-6">
              Access patient information, manage appointments, and review medical history.
            </p>
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={() => navigate("/login/doctor")}
            >
              Doctor Login
            </Button>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose IntelEJ Hospital?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-hospital-600 mb-2">100% Local</h3>
              <p className="text-gray-600">Your data never leaves your device. Complete privacy and security.</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-hospital-600 mb-2">AI Health Assistant</h3>
              <p className="text-gray-600">Get instant answers to health questions from our local AI system.</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-hospital-600 mb-2">Seamless Experience</h3>
              <p className="text-gray-600">Easy appointment scheduling and communication with your doctors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
