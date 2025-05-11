import React, { useState } from "react";
import FortuneSpinner from "./FortuneSpinner";
import FortuneResult from "./FortuneResult";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

const LovableSpinner = () => {
  const [selectedFortune, setSelectedFortune] = useState(null);
  const toast = useToast();

  const handleFortuneSelected = (fortune) => {
    setSelectedFortune(fortune);
    toast({
      title: "Fortune revealed!",
      description: "Your daily fortune has been unveiled.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      minH="100vh"
      py={12}
      px={4}
      bg="gray.50"
      backgroundImage="radial-gradient(rgba(155, 135, 245, 0.1) 1px, transparent 1px)"
      backgroundSize="24px 24px"
    >
      <Container maxW="md">
        <VStack textAlign="center" spacing={10}>
          <VStack spacing={4}>
            <Heading
              as="h1"
              fontSize="5xl"
              color="primary.500"
              letterSpacing="tight"
            >
              Welcome!
            </Heading>
            <Heading as="h2" fontSize="3xl" color="secondary.500" mb={4}>
              Fortune Spinner
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="md">
              Spin the wheel to reveal your daily fortune! What will the
              universe tell you today?
            </Text>
          </VStack>

          <FortuneSpinner onFortuneSelected={handleFortuneSelected} />
          <FortuneResult fortune={selectedFortune} />

          <Text mt={16} fontSize="sm" color="gray.500">
            Discover a new fortune every day!
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default LovableSpinner;
