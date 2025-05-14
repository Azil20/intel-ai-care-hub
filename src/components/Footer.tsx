
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Intelej Hosp</h3>
            <p className="text-gray-400">Providing secure, local healthcare solutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: Mounir.Khaoulaf@uit.ac.ma</p>
            <p className="text-gray-400">WhatsApp Only: +212 629320292</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© {new Date().getFullYear()} Intelej Hosp. All rights reserved.</p>
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent text-lg font-bold mt-2 inline-block animate-pulse-slow">
            Made by Mounir Khaoulaf and Mohamed Azri
          </div>
          <p className="mt-1 font-bold text-red-500 text-lg animate-bounce">
            Our Website Stands For Helping Patient Using Ai Locally, Securely and More Privacy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
