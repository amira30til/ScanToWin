import { useState } from "react";
import Wheel from "./Wheel";
import FortuneResult from "./FortuneResult";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Logo from "@/components/Logo";

const primaryColor = "#FF6B6B";
const secondaryColor = "#615EFC";

const FortuneWheel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reward, setReward] = useState(null);

  const giftHandler = (reward) => {
    setReward(reward);
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
          <VStack spacing={6}>
            <Logo w="60px" />
            <Heading as="h1" fontSize="3xl" letterSpacing="tight">
              Welcome!
            </Heading>
            <Heading as="h2" fontSize="3xl" color="secondary.500" mb={4}>
              Fortune Wheel
            </Heading>
            <Text fontSize="sm" color="gray.600" maxW="md">
              Tournez la roue pour découvrir votre gain ! Cliquez sur 'Lancer'
              et attendez que la roue s'arrête.
            </Text>
          </VStack>

          <Wheel
            onReward={giftHandler}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
          <FortuneResult gift={reward} isOpen={isOpen} onClose={onClose} />
        </VStack>
      </Container>
    </Box>
  );
};

export default FortuneWheel;
