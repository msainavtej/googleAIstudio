import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Cyberpunk Outrun', artist: 'AI Generated Dummy 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Neon Grid Surfer', artist: 'AI Generated Dummy 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Overdrive', artist: 'AI Generated Dummy 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center w-80 neon-box-fuchsia border border-fuchsia-500/30">
      <div className="w-20 h-20 bg-fuchsia-950 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_theme(colors.fuchsia.500)] animate-pulse">
        <Music className="w-10 h-10 text-fuchsia-400" />
      </div>
      
      <div className="text-center mb-6 w-full">
        <h3 className="text-lg font-bold text-white truncate neon-text-fuchsia">{currentTrack.title}</h3>
        <p className="text-fuchsia-300 text-sm font-mono truncate">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <button 
          onClick={prevTrack}
          className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors p-2 rounded-full hover:bg-fuchsia-500/20"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full p-4 transition-all shadow-[0_0_10px_theme(colors.fuchsia.600)] hover:shadow-[0_0_20px_theme(colors.fuchsia.400)]"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors p-2 rounded-full hover:bg-fuchsia-500/20"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full px-4">
        <Volume2 className="w-4 h-4 text-fuchsia-400" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-fuchsia-900 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded} 
        preload="auto"
      />
    </div>
  );
}
