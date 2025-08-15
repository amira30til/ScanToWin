import React from "react";
import { motion } from "framer-motion";

// Smooth fade-in animation for any content
export const FadeIn = ({ children, delay = 0, duration = 0.5, y = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    {children}
  </motion.div>
);

// Staggered animation for lists and grids
export const StaggerContainer = ({ children, staggerChildren = 0.1 }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      initial: {},
      animate: {
        transition: {
          staggerChildren,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, y = 20 }) => (
  <motion.div
    variants={{
      initial: {
        opacity: 0,
        y,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    }}
  >
    {children}
  </motion.div>
);

// Smooth hover animations for buttons and cards
export const HoverScale = ({ children, scale = 1.02, className = "" }) => (
  <motion.div
    whileHover={{
      scale,
      transition: { duration: 0.2, ease: "easeOut" },
    }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Smooth slide-in from different directions
export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.5,
}) => {
  const directionVariants = {
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Modal/Dialog animation
export const ModalAnimation = ({ children, isVisible }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{
      opacity: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.9,
      y: isVisible ? 0 : 20,
    }}
    transition={{
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    {children}
  </motion.div>
);

// Loading skeleton animation
export const LoadingSkeleton = ({
  className = "",
  width = "100%",
  height = "20px",
}) => (
  <motion.div
    animate={{
      backgroundColor: [
        "rgba(229, 231, 235, 0.4)",
        "rgba(229, 231, 235, 0.8)",
        "rgba(229, 231, 235, 0.4)",
      ],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={`rounded-md ${className}`}
    style={{ width, height }}
  />
);

// Page section animation
export const PageSection = ({ children, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className={className}
  >
    {children}
  </motion.section>
);

// Navigation menu animation
export const NavMenu = ({ children, isOpen }) => (
  <motion.div
    initial={false}
    animate={{
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : -10,
      scale: isOpen ? 1 : 0.95,
    }}
    transition={{
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    style={{ pointerEvents: isOpen ? "auto" : "none" }}
  >
    {children}
  </motion.div>
);
