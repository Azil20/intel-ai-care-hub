
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWelcomeStyles } from "@/hooks/use-welcome-styles";
import { X } from "lucide-react";

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [open, setOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Apply welcome styles
  useWelcomeStyles();

  useEffect(() => {
    // Create audio element
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_179e80c224.mp3?filename=ambient-piano-and-strings-148303.mp3");
    audio.volume = 0.3; // Set volume to 30%
    audioRef.current = audio;
    
    // Check if we've shown this popup before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';
    
    if (!hasSeenWelcome) {
      audio.play().catch(e => console.log("Audio play failed:", e));
    } else {
      setOpen(false);
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    localStorage.setItem('hasSeenWelcome', 'true');
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[420px] rounded-2xl ios-popup p-0 border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-gray-100/90 to-white/90 dark:from-gray-900/90 dark:to-black/90 backdrop-blur-2xl p-6 relative">
          <button 
            onClick={handleClose} 
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">IH</span>
            </div>
            
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              IntelEJ Hospital
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <p className="text-base text-gray-700 dark:text-gray-300 font-medium">PROJECT CREDITS</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">MOUNIR KHAOULAF & MOHAMED AZRI</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  FOR THE LAST YEAR PROJECT OF THE<br />UNIVERSITY OF IBN TOFAIL
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleClose}
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
