
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
      <DialogContent className="sm:max-w-[600px] glass-popup border-0 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-center mb-2 text-gradient">Welcome to IntelEJ Hospital</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="backdrop-blur-md bg-white/5 dark:bg-black/5 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8">
              <h3 className="text-2xl font-medium mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PROJECT CREDITS</h3>
              <div className="space-y-5">
                <p className="text-xl text-gray-600 dark:text-gray-300">THIS PROJECT WAS BUILT BY</p>
                <p className="text-3xl font-semibold my-3 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent pulse-animation">MOUNIR KHAOULAF & MOHAMED AZRI</p>
                <p className="text-xl text-gray-600 dark:text-gray-300">FOR THE LAST YEAR PROJECT OF THE</p>
                <p className="text-2xl font-semibold mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">UNIVERSITY OF IBN TOFAIL</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleClose}
            className="mt-6 px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all hover:shadow-lg hover:scale-105"
          >
            Continue to Hospital System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
