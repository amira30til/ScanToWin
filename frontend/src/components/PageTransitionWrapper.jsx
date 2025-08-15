import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";

export default function LanguageTransitionWrapper({ children }) {
  const { i18n } = useTranslation();
  const [prevLanguage, setPrevLanguage] = useState(i18n.language);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      const languages = ["en", "fr"];
      const currentIndex = languages.indexOf(i18n.language);
      const newIndex = languages.indexOf(lng);

      setDirection(newIndex > currentIndex ? 1 : -1);
      setPrevLanguage(i18n.language);
      setIsTransitioning(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 120);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [i18n]);

  const variants = {
    enter: (direction) => ({
      opacity: 0,
      y: direction > 0 ? 2 : -2, 
      scale: 0.998, 
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: (direction) => ({
      opacity: 0,
      y: direction > 0 ? -2 : 2,
      scale: 0.998,
    }),
  };

  const transition = {
    duration: 0.12,
    ease: [0.25, 0.46, 0.45, 0.94],
    opacity: { duration: 0.08 },
    scale: { duration: 0.1 },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={i18n.language}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          style={{
            width: "100%",
            height: "100%",
            willChange: isTransitioning ? "transform, opacity" : "auto",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
            WebkitBackfaceVisibility: "hidden",
            MozBackfaceVisibility: "hidden",
          }}
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => setIsTransitioning(false)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
