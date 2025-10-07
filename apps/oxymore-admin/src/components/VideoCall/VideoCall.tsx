import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  Maximize2,
  Minimize2,
  Share,
  MessageCircle,
  UserPlus,
  Crown,
  CameraOff
} from 'lucide-react';

interface VideoCallProps {
  appointment: {
    id: string;
    title: string;
    participants: string[];
    startTime: string;
    endTime: string;
    type: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isMuted: boolean;
  isHost: boolean;
  avatar?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ appointment, isOpen, onClose }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Vous',
      isVideoOn: true,
      isAudioOn: true,
      isMuted: false,
      isHost: true,
      avatar: '/avatars/admin.jpg'
    },
    {
      id: '2',
      name: 'Participant 1',
      isVideoOn: true,
      isAudioOn: true,
      isMuted: false,
      isHost: false,
      avatar: '/avatars/user1.jpg'
    },
    {
      id: '3',
      name: 'Participant 2',
      isVideoOn: false,
      isAudioOn: true,
      isMuted: true,
      isHost: false,
      avatar: '/avatars/user2.jpg'
    }
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  // Simuler la connexion
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsConnecting(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Timer pour la durée de l'appel
  useEffect(() => {
    if (isOpen && !isConnecting) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isConnecting]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    setIsMuted(!isMuted);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleEndCall = () => {
    onClose();
  };

  const handleInviteParticipant = () => {
    console.log('Inviting participant...');
  };

  const handleChat = () => {
    console.log('Opening chat...');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`bg-gradient-to-br from-purple-500/10 via-black/90 to-blue-500/10 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-6xl h-[700px] flex flex-col overflow-hidden relative ${
            isMinimized ? 'h-48 max-w-md' : ''
          } ${isFullscreen ? 'max-w-full h-screen rounded-none' : ''}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-black/30 border-b border-purple-500/20 backdrop-blur-sm z-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="font-orbitron text-lg font-semibold text-white m-0">{appointment.title}</h3>
                <span className="text-sm text-white/70 bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-500/30">
                  {formatDuration(callDuration)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <Users className="w-3.5 h-3.5" />
                <span>{participants.length} participants</span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMinimize}
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white/80 flex items-center justify-center transition-all hover:bg-white/10 hover:border-purple-500/50 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white/80 flex items-center justify-center transition-all hover:bg-white/10 hover:border-purple-500/50 hover:text-white"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-lg border border-red-500/30 bg-red-500/20 text-red-400 flex items-center justify-center transition-all hover:bg-red-500/30 hover:border-red-500"
              >
                <PhoneOff className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {isConnecting ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-15 h-15 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <Phone className="w-8 h-8" />
                </motion.div>
                <h3 className="font-orbitron text-2xl font-semibold m-0">Connexion en cours...</h3>
                <p className="text-base text-white/70 m-0">Connexion à l'appel vidéo</p>
              </div>
            ) : (
              <>
                {/* Video Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 overflow-hidden">
                  {participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative rounded-xl overflow-hidden bg-black/50 border-2 transition-all hover:border-purple-500/50 hover:scale-105 ${
                        participant.isHost ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' : 'border-purple-500/20'
                      }`}
                    >
                      <div className="relative w-full h-full min-h-[200px]">
                        {participant.isVideoOn ? (
                          <video
                            ref={participant.id === '1' ? localVideoRef : remoteVideoRef}
                            className="w-full h-full object-cover bg-black"
                            autoPlay
                            muted={participant.id === '1'}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 via-black/80 to-blue-500/10">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/30">
                              {participant.avatar ? (
                                <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-orbitron text-3xl font-semibold">
                                  {participant.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Participant Info */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                            {participant.isHost && <Crown className="w-3 h-3 text-yellow-400" />}
                            <span>{participant.name}</span>
                          </div>
                          <div className="flex gap-1">
                            {!participant.isVideoOn && <CameraOff className="w-3 h-3 text-white/60" />}
                            {participant.isMuted && <MicOff className="w-3 h-3 text-white/60" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 p-5 bg-black/30 border-t border-purple-500/20 backdrop-blur-sm">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleAudio}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm ${
                        !isAudioOn
                          ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-purple-500/50 hover:text-white'
                      }`}
                    >
                      {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVideo}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm ${
                        !isVideoOn
                          ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-purple-500/50 hover:text-white'
                      }`}
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleScreenShare}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm ${
                        isScreenSharing
                          ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 hover:border-green-500'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-purple-500/50 hover:text-white'
                      }`}
                    >
                      <Share className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleChat}
                      className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 text-white/80 flex items-center justify-center transition-all backdrop-blur-sm hover:bg-white/20 hover:border-purple-500/50 hover:text-white"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleInviteParticipant}
                      className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 text-white/80 flex items-center justify-center transition-all backdrop-blur-sm hover:bg-white/20 hover:border-purple-500/50 hover:text-white"
                    >
                      <UserPlus className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 text-white/80 flex items-center justify-center transition-all backdrop-blur-sm hover:bg-white/20 hover:border-purple-500/50 hover:text-white"
                    >
                      <Settings className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEndCall}
                    className="w-14 h-14 rounded-full border-2 border-red-500/50 bg-red-500/30 text-red-400 flex items-center justify-center transition-all backdrop-blur-sm hover:bg-red-500/50 hover:border-red-500 hover:scale-110"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
