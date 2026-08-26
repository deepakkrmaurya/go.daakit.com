import React, { useState, useEffect } from 'react';

const ChristmasHeader = ({ selected, handleSelect, advanceFilters, setAdvanceFilters, getAnalytics }) => {
    const [wishIndex, setWishIndex] = useState(0);
    const [isSnowing, setIsSnowing] = useState(true);

    const christmasWishes = [
        "🎄 Merry Christmas! May your analytics shine bright! ✨",
        "🎅 Ho Ho Ho! Wishing you joyful insights this festive season! 🎁",
        "🌟 May your metrics be merry and your data always insightful! 📊",
    ];

    // Rotate Christmas wishes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setWishIndex((prev) => (prev + 1) % christmasWishes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            {isSnowing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-white opacity-70"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${10 + Math.random() * 10}px`,
                                animation: `fall ${3 + Math.random() * 5}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        >
                            ❄️
                        </div>
                    ))}
                </div>
            )}

            {/* Christmas Wish Banner */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-red-50 to-green-50 border border-red-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl animate-bounce">🎅</div>
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-red-700 mb-1">
                                {christmasWishes[wishIndex]}
                            </p>
                            <p className="text-sm text-gray-600">
                                Wishing you and your team a very Merry Christmas and a Prosperous New Year! 🎄
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes light-scroll {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-light-scroll {
          animation: light-scroll 4s linear infinite;
          display: flex;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    );
};

export default ChristmasHeader;