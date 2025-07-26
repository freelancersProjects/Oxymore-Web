import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { useMapPicker } from '../../context/MapPickerContext';
import MatchSummary from './MatchSummary';
import { Map, MapStatus } from './types';

const initialMaps: Map[] = [
  {
    id: 'ancient',
    name: 'Ancient',
    image: '/maps/ancient.jpg',
    status: 'available'
  },
  {
    id: 'inferno',
    name: 'Inferno',
    image: '/maps/inferno.jpg',
    status: 'available'
  },
  {
    id: 'mirage',
    name: 'Mirage',
    image: '/maps/mirage.jpg',
    status: 'available'
  },
  {
    id: 'nuke',
    name: 'Nuke',
    image: '/maps/nuke.jpg',
    status: 'available'
  },
  {
    id: 'overpass',
    name: 'Overpass',
    image: '/maps/overpass.jpg',
    status: 'available'
  },
  {
    id: 'vertigo',
    name: 'Vertigo',
    image: '/maps/vertigo.jpg',
    status: 'available'
  },
  {
    id: 'anubis',
    name: 'Anubis',
    image: '/maps/anubis.jpg',
    status: 'available'
  }
];

type Phase = 'team1_pick' | 'team2_pick' | 'team1_ban' | 'team2_ban' | 'decider' | 'finished';

const phaseSequence: Phase[] = [
  'team1_ban',   // Team 1 bans first map
  'team2_ban',   // Team 2 bans second map
  'team1_pick',  // Team 1 picks first map
  'team2_pick',  // Team 2 picks second map
  'team1_ban',   // Team 1 bans third map
  'team2_ban',   // Team 2 bans fourth map
  'decider'      // Last map is decider
];

const MapPicker = () => {
  const { isOpen, closeMapPicker } = useMapPicker();
  const [maps, setMaps] = useState<Map[]>(initialMaps);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [hoveredMap, setHoveredMap] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const phase = currentPhase < phaseSequence.length ? phaseSequence[currentPhase] : 'finished';
  const isTeam1Turn = phase.startsWith('team1_');

  const handleMapClick = (mapId: string) => {
    if (phase === 'finished' || maps.find(m => m.id === mapId)?.status !== 'available') return;

    const newMaps = maps.map(map => {
      if (map.id === mapId) {
        const status: MapStatus = phase === 'decider' ? 'decider' 
          : phase.includes('pick') ? (isTeam1Turn ? 'team1_picked' : 'team2_picked')
          : (isTeam1Turn ? 'team1_banned' : 'team2_banned');
        return { ...map, status };
      }
      return map;
    });

    setMaps(newMaps);
    setSelectedMap(mapId);
    setTimeout(() => {
      setSelectedMap(null);
      if (currentPhase + 1 >= phaseSequence.length) {
        setTimeout(() => setShowSummary(true), 500);
      }
      setCurrentPhase(prev => prev + 1);
    }, 1000);
  };

  const getPhaseText = () => {
    if (phase === 'finished') return 'Pick/Ban Phase Complete';
    const team = isTeam1Turn ? 'Team 1' : 'Team 2';
    const action = phase.includes('pick') ? 'PICK' : 'BAN';
    return `${team} - ${action} PHASE`;
  };

  const getMapStyle = (status: Map['status']) => {
    switch (status) {
      case 'team1_picked':
        return 'border-blue-500 brightness-100 shadow-[0_0_30px_rgba(59,130,246,0.5)]';
      case 'team2_picked':
        return 'border-red-500 brightness-100 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
      case 'team1_banned':
        return 'border-blue-500 brightness-50 grayscale';
      case 'team2_banned':
        return 'border-red-500 brightness-50 grayscale';
      case 'decider':
        return 'border-yellow-500 brightness-100 shadow-[0_0_30px_rgba(234,179,8,0.5)]';
      default:
        return 'border-[var(--border-color)] hover:border-oxymore-purple brightness-75 hover:brightness-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showSummary ? (
            <MatchSummary 
              maps={maps} 
              onClose={() => {
                setShowSummary(false);
                closeMapPicker();
                setMaps(initialMaps);
                setCurrentPhase(0);
              }} 
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-oxymore-purple/20 to-black overflow-hidden"
            >
              {/* Background Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />
              <div className="absolute inset-0 bg-[url('/effects/noise.png')] opacity-[0.02] mix-blend-overlay" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-8 max-w-[2000px] mx-auto">
                {/* Header */}
                <motion.div 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-oxymore-purple to-red-500 bg-clip-text text-transparent pb-2">
                    Map Pick & Ban Phase
                  </h2>
                  <p className="text-2xl text-white/60">
                    {phase === 'finished' ? 'All maps have been selected' : 
                     phase === 'decider' ? 'Decider Map' :
                     `${isTeam1Turn ? 'Team 1' : 'Team 2'}'s turn to ${phase.includes('pick') ? 'pick' : 'ban'}`}
                  </p>
                </motion.div>

                {/* Maps Grid */}
                <div className="w-full grid grid-cols-4 gap-8 px-12">
                  {maps.map((map) => {
                    const isAvailable = map.status === 'available';
                    const isSelected = selectedMap === map.id;
                    const isHovered = hoveredMap === map.id;
                    
                    return (
                      <motion.div
                        key={map.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: isSelected ? 1.1 : isHovered ? 1.05 : 1, 
                          opacity: isAvailable ? 1 : 0.5,
                          y: isSelected ? -20 : 0
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => handleMapClick(map.id)}
                        onHoverStart={() => setHoveredMap(map.id)}
                        onHoverEnd={() => setHoveredMap(null)}
                        className={`relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer
                          ${isAvailable ? 'hover:shadow-[0_0_50px_rgba(120,0,255,0.3)]' : 'cursor-not-allowed'}
                          transition-all duration-300`}
                      >
                        {/* Background Image */}
                        <img
                          src={map.image}
                          alt={map.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className={`absolute inset-0 transition-colors duration-300
                          ${map.status === 'team1_picked' ? 'bg-gradient-to-t from-blue-500/90 via-blue-500/20 to-transparent' :
                            map.status === 'team2_picked' ? 'bg-gradient-to-t from-red-500/90 via-red-500/20 to-transparent' :
                            map.status === 'team1_banned' ? 'bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent' :
                            map.status === 'team2_banned' ? 'bg-gradient-to-t from-red-900/90 via-red-900/20 to-transparent' :
                            map.status === 'decider' ? 'bg-gradient-to-t from-yellow-500/90 via-yellow-500/20 to-transparent' :
                            'bg-gradient-to-t from-black/80 via-black/20 to-transparent hover:from-black/60'}`}
                        />

                        {/* Map Info */}
                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start">
                          <motion.h3 
                            initial={false}
                            animate={{ scale: isHovered ? 1.1 : 1, x: isHovered ? 10 : 0 }}
                            className="text-4xl font-bold text-white mb-3"
                          >
                            {map.name}
                          </motion.h3>
                          
                          {map.status !== 'available' && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold
                                ${map.status === 'team1_picked' ? 'bg-blue-500/30 text-blue-200' :
                                  map.status === 'team2_picked' ? 'bg-red-500/30 text-red-200' :
                                  map.status === 'team1_banned' ? 'bg-blue-900/30 text-blue-300' :
                                  map.status === 'team2_banned' ? 'bg-red-900/30 text-red-300' :
                                  'bg-yellow-500/30 text-yellow-200'}`}
                            >
                              {map.status === 'decider' ? (
                                <>
                                  <Crown className="w-5 h-5" />
                                  <span>DECIDER</span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {map.status.includes('team1') ? 'TEAM 1' : 'TEAM 2'}
                                  </span>
                                  <span>
                                    {map.status.includes('picked') ? 'PICK' : 'BAN'}
                                  </span>
                                </>
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* Selection Animation */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: [1.5, 2], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                            className={`absolute inset-0 rounded-2xl
                              ${phase.includes('pick') ? 
                                (isTeam1Turn ? 'border-4 border-blue-500' : 'border-4 border-red-500') :
                                (isTeam1Turn ? 'border-4 border-blue-900' : 'border-4 border-red-900')}`}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    closeMapPicker();
                    setMaps(initialMaps);
                    setCurrentPhase(0);
                  }}
                  className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 
                    flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default MapPicker; 
 
 