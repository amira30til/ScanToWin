import React, { useEffect, useState } from "react";
import { Box, Heading, Text, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const celebrate = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  10% { transform: scale(1.2); opacity: 1; }
  20% { transform: scale(0.9); }
  30% { transform: scale(1.1); }
  40% { transform: scale(1); }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const FortuneResult = ({ fortune }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (fortune) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [fortune]);

  if (!fortune) return null;

  return (
    <Box
      mt={6}
      p={6}
      bg="white"
      borderRadius="xl"
      borderWidth="2px"
      borderColor="primary.100"
      boxShadow="lg"
      maxW="md"
      mx="auto"
      animation={show ? `${celebrate} 0.8s ease-out forwards` : "none"}
      opacity={show ? 1 : 0}
    >
      <Heading
        as="h3"
        fontSize="xl"
        fontWeight="semibold"
        color="primary.500"
        mb={2}
      >
        Your Fortune
      </Heading>
      <Text fontSize="lg" color="gray.700">
        {fortune}
      </Text>
      <HStack mt={3} justify="center" gap={1}>
        {[...Array(3)].map((_, i) => (
          <Text
            key={i}
            fontSize="2xl"
            color="fortune.yellow"
            css={{
              animation: `${float} 3s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ✨
          </Text>
        ))}
      </HStack>
    </Box>
  );
};

export default FortuneResult;
