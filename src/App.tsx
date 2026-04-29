import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col relative font-sans">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        {/* Giant glowing orbs in bg */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Retro Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none top-[50%]"
          style={{
            backgroundImage: 'linear-gradient(theme(colors.fuchsia.500) 1px, transparent 1px), linear-gradient(90deg, theme(colors.fuchsia.500) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'top center'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-center items-center border-b border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Terminal className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-2xl font-bold font-mono tracking-widest uppercase neon-text-cyan">
            Synths &amp; Serpents
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-6 gap-12 flex-col xl:flex-row">
        {/* Game Area */}
        <div className="flex-shrink-0 z-20">
          <SnakeGame />
        </div>

        {/* Music Player Area - On large screens it sits next, on small screens below */}
        <div className="z-20 transform xl:translate-y-12">
          <MusicPlayer />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full p-4 text-center font-mono text-xs text-white/30 tracking-widest pb-6">
        &copy; {new Date().getFullYear()} NEON CORP. ALL SYSTEMS NOMINAL.
      </footer>
    </div>
  );
}
