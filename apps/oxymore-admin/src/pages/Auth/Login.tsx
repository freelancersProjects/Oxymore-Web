import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../api/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.post('/auth/login', {
        email,
        password
      });

      if (response.user.role !== 'admin') {
        setError('Access denied');
        return;
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-md px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 mb-6 shadow-lg shadow-purple-500/20">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111111] rounded-2xl p-8 shadow-xl backdrop-blur-xl border border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#111111] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                'Continue'
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Having trouble? Contact{' '}
          <a href="mailto:support@oxymore.gg" className="text-purple-500 hover:text-purple-400 transition duration-200">
            support@oxymore.gg
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 
 
 