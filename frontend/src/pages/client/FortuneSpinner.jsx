import React, { useState, useRef } from "react";
import { Box, Button, Center, VStack } from "@chakra-ui/react";

const fortunes = [
  "Adventure awaits around the corner!",
  "Your creativity will lead to success.",
  "A surprising friendship will blossom soon.",
  "Trust your intuition on an important decision.",
  "Joy will find you when you least expect it.",
  "A small change will bring unexpected happiness.",
  "Your kindness will return to you tenfold.",
  "The path ahead has exciting opportunities.",
];

const colors = [
  "fortune.purple",
  "fortune.pink",
  "fortune.blue",
  "fortune.yellow",
  "fortune.green",
  "fortune.orange",
];

const FortuneSpinner = ({ onFortuneSelected }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedFortune, setSelectedFortune] = useState(null);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedFortune(null);

    // Random number of full rotations (3-5) plus a random angle
    const spinRotations = 3 + Math.floor(Math.random() * 3);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = spinRotations * 360 + randomAngle;

    // Calculate which fortune is selected based on where the wheel stops
    const fortuneIndex = Math.floor((randomAngle / 360) * fortunes.length);
    const selected = fortunes[fortuneIndex];

    setRotation(totalRotation);

    // Wait for animation to finish before showing the result
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedFortune(selected);
      onFortuneSelected(selected);
    }, 5000); // Sync with the CSS animation duration
  };

  return (
    <VStack spacing={8}>
      <Box position="relative" w={["60", "80"]} h={["60", "80"]}>
        <Box
          position="absolute"
          top="-15px"
          left="50%"
          transform="translateX(-50%)"
          borderLeft="15px solid transparent"
          borderRight="15px solid transparent"
          borderTop="25px solid"
          borderTopColor="primary.500"
          zIndex={10}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />
        <Box
          ref={wheelRef}
          w="full"
          h="full"
          borderRadius="full"
          overflow="hidden"
          boxShadow="0 10px 25px -5px rgba(155, 135, 245, 0.4)"
          transition={
            isSpinning
              ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none"
          }
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {fortunes.map((_, index) => {
            const angle = (360 / fortunes.length) * index;
            const skew = 90 - 360 / fortunes.length;
            return (
              <Box
                key={index}
                position="absolute"
                w="full"
                h="full"
                transformOrigin="bottom left"
                bg={colors[index % colors.length]}
                style={{
                  transform: `rotate(${angle}deg) skew(${skew}deg)`,
                }}
              ></Box>
            );
          })}
        </Box>
      </Box>

      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        bg="primary.500"
        color="white"
        size="lg"
        fontSize="lg"
        px={8}
        py={6}
        _hover={{ bg: "primary.600", transform: "scale(1.05)" }}
        _active={{ bg: "primary.700" }}
        boxShadow={isSpinning ? "none" : "0 0 15px rgba(155, 135, 245, 0.5)"}
        opacity={isSpinning ? 0.7 : 1}
        transition="all 0.3s"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </VStack>
  );
};

export default FortuneSpinner;
