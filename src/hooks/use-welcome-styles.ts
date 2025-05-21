
import { useEffect } from 'react';

export const useWelcomeStyles = () => {
  useEffect(() => {
    // Add these styles to the document if they don't exist already
    if (!document.getElementById('welcome-popup-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'welcome-popup-styles';
      styleElement.textContent = `
        .ios-popup {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border-radius: 20px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12), 
                      0 5px 10px rgba(0, 0, 0, 0.08) !important;
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        .dark .ios-popup {
          background: rgba(25, 25, 30, 0.8) !important;
        }

        @keyframes slideInUp {
          0% { 
            opacity: 0;
            transform: translateY(30px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .text-gradient {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes gentle-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }

        .pulse-animation {
          animation: gentle-pulse 3s infinite ease-in-out;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);
};
