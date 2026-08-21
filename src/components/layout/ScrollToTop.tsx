import React, { useState, useEffect } from 'react';
import { ArrowUp, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMadrasa } from '../../context/MadrasaContext';

export const ScrollToTop: React.FC = () => {
  const { currentTrack } = useMadrasa();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;

      // Show when scrolled down past the initial viewport height
      setIsVisible(scrollY > viewportHeight * 0.75);

      // Calculate scroll progress percentage (0 - 100)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // If audio player is active at bottom, adjust bottom offset to prevent overlap
  const bottomPositionClass = currentTrack ? 'bottom-24 sm:bottom-28' : 'bottom-6 sm:bottom-8';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="scroll-to-top-container"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed right-4 sm:right-6 z-40 ${bottomPositionClass}`}
        >
          <button
            id="scroll-to-top-button"
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#0a4d28] via-[#0d5c31] to-[#1a2e1a] text-white shadow-xl hover:shadow-2xl border-2 border-[#d4af37]/60 hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 cursor-pointer focus:outline-none focus:ring-3 focus:ring-[#d4af37]/50"
          >
            {/* Circular Progress Border Background */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-emerald-950/40"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-[#d4af37] transition-all duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - scrollProgress / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Icon and Arrow */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37] group-hover:text-amber-200 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </div>

            {/* Subtle glow / hover aura */}
            <span className="absolute -inset-1 rounded-2xl bg-[#d4af37]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            {/* Mobile / Screen Reader Tooltip */}
            <span className="sr-only">পৃষ্ঠার শুরুতে যান (Scroll to Top)</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
