import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Hash } from 'lucide-react';

const UUIDGenerator = () => {
  const [uuid, setUuid] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);

  const generateUUID = () => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    setCopied(false);
  };

  const generateMultipleUUIDs = () => {
    const uuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuid(uuids.join('\n'));
    setCopied(false);
  };

  const clearUUID = () => {
    setUuid('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--card-background)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">UUID Generator</h1>
                <p className="text-purple-100">Generate unique identifiers instantly</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Number of UUIDs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-2 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateUUID}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Single
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateMultipleUUIDs}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Hash className="w-4 h-4" />
                    Generate {count}
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--overlay-hover)] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">UUID Info</h3>
                  <div className="space-y-2 text-sm text-[var(--text-primary)]">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="text-purple-400">UUID v4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="text-purple-400">36 characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="text-purple-400">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Generated UUID(s)</h3>
                {uuid && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearUUID}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>

              <div className="space-y-3">
                {uuid ? (
                  uuid.split('\n').map((singleUuid, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all duration-300 group"
                      onClick={() => {
                        navigator.clipboard.writeText(singleUuid);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                            UUID #{index + 1}
                          </div>
                          <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200 tracking-wider select-all group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                            {singleUuid}
                          </div>
                        </div>
                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            Click to copy
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg p-8 min-h-[200px]">
                    <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                      <div className="text-center">
                        <Hash className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Click "Generate Single" or "Generate Multiple" to create UUIDs</p>
                        <p className="text-sm mt-2 opacity-75">Generated UUIDs will appear as large, clickable codes</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-center font-medium"
                >
                  UUID copied to clipboard!
                </motion.div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--overlay-hover)] p-4 rounded-lg">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Cryptographically Secure</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Uses crypto.randomUUID() for maximum security and uniqueness
                </p>
              </div>
              <div className="bg-[var(--overlay-hover)] p-4 rounded-lg">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">RFC 4122 Compliant</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Follows the UUID standard for maximum compatibility
                </p>
              </div>
              <div className="bg-[var(--overlay-hover)] p-4 rounded-lg">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Instant Generation</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Generate single or multiple UUIDs with one click
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UUIDGenerator;
