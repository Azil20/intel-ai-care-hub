
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} IntelEJ Hospital. All rights reserved.</p>
        <p className="mt-1">This application runs completely locally for your privacy and security.</p>
      </div>
    </footer>
  );
};

export default Footer;
