import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageSquare,
  Users,
  Settings,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useLiveMatch } from '../../context/LiveMatchContext';



const mockMatch = {
  id: '1',
  team1: {
    name: 'Team Liquid',
    score: 12,
    logo: '🌊'
  },
  team2: {
    name: 'NAVI',
    score: 8,
    logo: '⭐'
  },
  map: 'Inferno',
  viewers: 1247,
  tournament: 'CS2 Major 2024'
};

const LiveMatch = () => {
  const { isOpen, closeLiveMatch } = useLiveMatch();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mettre à jour l'état de lecture de la vidéo
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Gestionnaire de raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'f') {
          e.preventDefault();
          toggleFullscreen();
        } else if (e.key === 'm') {
          e.preventDefault();
          setIsMuted(!isMuted);
        } else if (e.key === ' ') {
          e.preventDefault();
          setIsPlaying(!isPlaying);
        } else if (e.key === 'c') {
          e.preventDefault();
          setShowChat(!showChat);
        } else if (e.key === 'Escape' && !isFullscreen) {
          e.preventDefault();
          closeLiveMatch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMuted, isPlaying, showChat, isFullscreen, closeLiveMatch]);

  // Gestionnaire de plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Gestionnaire de changement de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black"
        >
          <div ref={containerRef} className="relative h-full flex">
            {/* Stream principal */}
            <div className="flex-1 relative">
              {/* Vidéo */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/test.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />

              {/* Overlay du haut */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                      <span className="text-red-500 font-semibold text-sm">LIVE</span>
                    </div>
                    <h2 className="text-white font-bold">{mockMatch.tournament}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{mockMatch.viewers}</span>
                    </div>
                    <button
                      onClick={closeLiveMatch}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="absolute top-20 left-4 bg-black/80 rounded-xl overflow-hidden">
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mockMatch.team1.logo}</span>
                    <span className="text-white font-bold">{mockMatch.team1.name}</span>
                    <span className="text-2xl font-bold text-white">{mockMatch.team1.score}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mockMatch.team2.logo}</span>
                    <span className="text-white font-bold">{mockMatch.team2.name}</span>
                    <span className="text-2xl font-bold text-white">{mockMatch.team2.score}</span>
                  </div>
                </div>
                <div className="bg-gradient-oxymore px-4 py-2">
                  <span className="text-white text-sm font-medium">{mockMatch.map}</span>
                </div>
              </div>

              {/* Contrôles */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-5 h-5 text-white" />
                      ) : (
                        <Maximize2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="w-[350px] bg-[var(--card-background)] border-l border-[var(--border-color)]"
                >
                  <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h3 className="text-[var(--text-primary)] font-semibold">Live Chat</h3>
                    <button
                      onClick={() => setShowChat(false)}
                      className="p-1 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
                    </button>
                  </div>

                  <div className="flex flex-col h-[calc(100%-60px)]">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {/* Simuler des messages */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="mb-4">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold">U</span>
                            </div>
                            <div>
                              <p className="text-[var(--text-primary)] text-sm">
                                <span className="font-semibold">User_{i + 1}</span>
                                <span className="text-[var(--text-secondary)]"> · </span>
                                <span className="text-[var(--text-muted)] text-xs">2m ago</span>
                              </p>
                              <p className="text-[var(--text-secondary)] text-sm">
                                {i % 2 === 0 ? 'Let\'s go Team Liquid! 🌊' : 'NAVI is on fire! 🔥'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border-color)]">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Send a message..."
                          className="w-full bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-xl pl-4 pr-10 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple/50"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--overlay-active)] rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveMatch;

