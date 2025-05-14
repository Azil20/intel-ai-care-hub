
import { useEffect } from 'react';

export const useWelcomeStyles = () => {
  useEffect(() => {
    // Add these styles to the document if they don't exist already
    if (!document.getElementById('welcome-popup-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'welcome-popup-styles';
      styleElement.textContent = `
        .glass-popup {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        }

        .dark .glass-popup {
          background: rgba(30, 30, 35, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .text-gradient {
          background: linear-gradient(to right, #3b82f6, #10b981);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes gentle-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }

        .pulse-animation {
          animation: gentle-pulse 3s infinite ease-in-out;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);
};
