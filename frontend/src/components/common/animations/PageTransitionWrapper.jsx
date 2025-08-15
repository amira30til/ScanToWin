import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Smooth and modern page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

// Smooth transition timing
const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier curve for smooth feel
  duration: 0.4,
};

// Loading overlay for route changes
const LoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
    >
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    </motion.div>
  </motion.div>
);

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle route changes with loading state
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>
    </>
  );
};

export default PageTransitionWrapper;
