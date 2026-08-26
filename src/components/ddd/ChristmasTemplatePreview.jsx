import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChristmasWishBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentWish, setCurrentWish] = useState(0);

  const wishes = [
    {
      title: "🎄 Christmas Special!",
      message: "Get 50% OFF on all festive orders",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50"
    },
    {
      title: "✨ Holiday Bonanza!",
      message: "Free delivery + extra 20% cashback",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "⭐ Festive Flash Sale!",
      message: "Limited time offers ending soon",
      gradient: "from-orange-500 to-yellow-500",
      bgGradient: "from-orange-50 to-yellow-50"
    },
    {
      title: "🦌 Merry Christmas!",
      message: "Special combos at unbelievable prices",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWish((prev) => (prev + 1) % wishes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  const currentWishData = wishes[currentWish];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4"
      >
        <div className={`bg-gradient-to-br ${currentWishData.bgGradient} border-2 border-opacity-30 rounded-2xl shadow-2xl overflow-hidden relative`}>
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
          
          {/* Santa Animation */}
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-6 text-5xl"
          >
            🎅
          </motion.div>

          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full animate-pulse">
                  🔥 FLASH SALE
                </span>
                <span className="px-3 py-1 border border-orange-500 text-orange-600 text-sm font-bold rounded-full">
                  ⏰ 24:59:59
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  ⭐ 4.8
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-6">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${currentWishData.gradient} rounded-full flex items-center justify-center text-4xl shadow-lg`}>
                  {currentWishData.title.split(' ')[0]}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow">
                  50% OFF
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWish}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={`text-3xl font-bold bg-gradient-to-r ${currentWishData.gradient} bg-clip-text text-transparent mb-2`}>
                      {currentWishData.title}
                    </h2>
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                      {currentWishData.message}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {['🚚 Free Delivery', '💳 Easy Returns', '🎯 Best Prices', '⭐ Premium Quality'].map((feature, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white bg-opacity-50 rounded-lg text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 bg-gradient-to-r ${currentWishData.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
                      >
                        🛒 Shop Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition-colors"
                      >
                        👀 View Offers
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Offer ends in:</span>
                <span className="font-bold text-red-600">00:24:59</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30, ease: "linear" }}
                  className={`h-full bg-gradient-to-r ${currentWishData.gradient}`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Add to tailwind.config.js
/*
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}
*/

export default ChristmasWishBanner;