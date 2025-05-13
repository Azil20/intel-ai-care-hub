
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Intelej Hosp</h3>
            <p className="text-gray-400">Providing secure, local healthcare solutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: info@intelejhosp.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <p className="text-gray-400">Privacy Policy</p>
            <p className="text-gray-400">Terms of Service</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Intelej Hosp. All rights reserved.</p>
          <p className="mt-2">Made by Mounir Khaoulaf and Mohamed Azri</p>
          <p className="mt-1">This application runs completely locally for your privacy and security.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
