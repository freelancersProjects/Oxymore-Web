import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameMap, SelectedMap } from './types';

interface MatchSummaryProps {
  maps: GameMap[];
  onClose: () => void;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({ maps, onClose }): React.JSX.Element => {
  const selectedMaps = maps.filter((map): map is SelectedMap =>
    map.status === 'team1_picked' ||
    map.status === 'team2_picked' ||
    map.status === 'decider'
  );

  // Lance les confettis
  React.useEffect(() => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = (): void => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.8 },
        colors: ['#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.8 },
        colors: ['#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-[30px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[url('/effects/noise.png')] opacity-[0.02] mix-blend-overlay" />

      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Titre */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm mb-8"
          >
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h2 className="text-7xl font-bold text-white">Best of 5</h2>
          </motion.div>
          <p className="text-2xl text-white/60">First to 3 maps wins the series</p>
        </motion.div>

        {/* Maps */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-3 gap-8">
          {selectedMaps.map((map, index) => (
            <motion.div
              key={map.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Numéro de map */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full
                  flex items-center justify-center z-10 backdrop-blur-sm
                  ${map.status === 'team1_picked'
                    ? 'bg-blue-500/30 ring-2 ring-blue-500/50'
                    : map.status === 'team2_picked'
                    ? 'bg-red-500/30 ring-2 ring-red-500/50'
                    : 'bg-yellow-500/30 ring-2 ring-yellow-500/50'}`}
              >
                <span className="text-3xl font-bold text-white">
                  {`#${index + 1}`}
                </span>
              </motion.div>

              {/* Card de map */}
              <div className={`relative aspect-video rounded-2xl overflow-hidden transition-all
                group-hover:scale-105 group-hover:-translate-y-2 duration-300
                ${map.status === 'team1_picked'
                  ? 'ring-4 ring-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
                  : map.status === 'team2_picked'
                  ? 'ring-4 ring-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                  : 'ring-4 ring-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]'}`}
              >
                <img
                  src={map.image}
                  alt={map.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20
                  flex flex-col justify-end p-8 group-hover:from-black/80">
                  <motion.h3
                    initial={false}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-white mb-4 group-hover:scale-110 origin-left transition-transform"
                  >
                    {map.name}
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-xl font-bold backdrop-blur-sm
                      ${map.status === 'team1_picked'
                        ? 'bg-blue-500/30 text-blue-200 ring-1 ring-blue-500/50'
                        : map.status === 'team2_picked'
                        ? 'bg-red-500/30 text-red-200 ring-1 ring-red-500/50'
                        : 'bg-yellow-500/30 text-yellow-200 ring-1 ring-yellow-500/50'}`}
                  >
                    {map.status === 'decider' ? (
                      <>
                        <Crown className="w-6 h-6" />
                        <span>DECIDER MAP</span>
                      </>
                    ) : (
                      <>
                        <span>{map.status === 'team1_picked' ? 'TEAM 1' : 'TEAM 2'}</span>
                        <span>PICK</span>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton de fermeture */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onClose}
          className="mt-20 mx-auto block px-10 py-4 bg-white/5 backdrop-blur-sm text-white
            rounded-xl text-xl font-medium hover:bg-white/10 transition-all duration-300"
        >
          CLOSE
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MatchSummary;
