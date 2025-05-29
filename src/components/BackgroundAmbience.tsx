
import React, { useEffect, useRef } from 'react';

const BackgroundAmbience: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Start playing the background music when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }, []);

  return (
    <>
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
        {/* Fallback for browsers that don't support the audio element */}
        Your browser does not support the audio element.
      </audio>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-hospital-500/10 rounded-full animate-float"
              style={{
                width: Math.random() * 40 + 10 + 'px',
                height: Math.random() * 40 + 10 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's',
              }}
            />
          ))}
        </div>

        {/* Gradient waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hospital-500/5 via-transparent to-hospital-600/5 animate-pulse-gentle" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-hospital-400/5 via-transparent to-hospital-700/5 animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        </div>

        {/* Moving geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-hospital-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-hospital-600/20 rounded-lg animate-bounce" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-3/4 w-16 h-16 bg-hospital-400/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>
      </div>
    </>
  );
};

export default BackgroundAmbience;
