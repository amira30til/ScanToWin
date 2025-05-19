import React, { useState } from "react";
import FortuneSpinner from "./FortuneSpinner";
import FortuneResult from "./FortuneResult";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useToast } from "@/hooks";

const LovableSpinner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFortune, setSelectedFortune] = useState(null);
  const toast = useToast();

  const handleFortuneSelected = (fortune) => {
    setSelectedFortune(fortune);
    toast("Fortune revealed!", "success");
    onOpen();
  };

  return (
    <Box
      h="100vh"
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
            <Text fontSize="sm" color="gray.600" maxW="md">
              Tournez la roue pour découvrir votre gain ! Cliquez sur 'Lancer'
              et attendez que la roue s'arrête.
            </Text>
          </VStack>

          <FortuneSpinner onFortuneSelected={handleFortuneSelected} />
          <FortuneResult
            // fortune={selectedFortune}
            gift="Drink"
            isOpen={isOpen}
            onClose={onClose}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default LovableSpinner;
