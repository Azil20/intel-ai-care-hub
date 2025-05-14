
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWelcomeStyles } from "@/hooks/use-welcome-styles";

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
      <DialogContent className="sm:max-w-[600px] glass-popup">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-2">Welcome to IntelEJ Hospital</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-1 rounded-lg pulse-animation">
            <div className="bg-background dark:bg-gray-900 p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4 text-gradient">PROJECT CREDITS</h3>
              <p className="text-lg font-medium">THIS PROJECT WAS BUILT BY</p>
              <p className="text-2xl font-bold my-3 text-blue-500 dark:text-blue-400">MOUNIR KHAOULAF & MOHAMED AZRI</p>
              <p className="text-lg font-medium">FOR THE LAST YEAR PROJECT OF THE</p>
              <p className="text-xl font-bold mt-3 text-teal-600 dark:text-teal-400">UNIVERSITY OF IBN TOFAIL</p>
            </div>
          </div>
          
          <Button 
            onClick={handleClose}
            className="mt-4 px-8 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-md"
          >
            Continue to Hospital System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
