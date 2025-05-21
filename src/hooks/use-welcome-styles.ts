
import { useEffect } from 'react';

export const useWelcomeStyles = () => {
  useEffect(() => {
    // Add these styles to the document if they don't exist already
    if (!document.getElementById('welcome-popup-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'welcome-popup-styles';
      styleElement.textContent = `
        .glass-popup {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border-radius: 24px !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.15) !important;
        }

        .dark .glass-popup {
          background: rgba(25, 25, 30, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
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
