import { useState } from "react";
import Wheel from "./Wheel";
import FortuneResultModal from "./FortuneResultModal";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getShop } from "@/services/shopService";
import { useQuery } from "@tanstack/react-query";
import tinycolor from "tinycolor2";

const FortuneWheel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reward, setReward] = useState(null);
  const { shopId } = useParams();

  const { data: shop, isLoading } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  const rewardHandler = (reward) => {
    setReward(reward);
    onOpen();
  };

  if (isLoading) return <div>loading...</div>;

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
            <Image
              objectFit="cover"
              src={shop?.logo ?? ""}
              alt="logo"
              h="auto"
              w="180px"
            />
            <Heading as="h1" fontSize="3xl" letterSpacing="tight">
              Welcome!
            </Heading>

            <Heading
              as="h2"
              fontSize="3xl"
              color={getAdjustedColor(shop?.gameColor1)}
              mb={4}
            >
              Fortune Wheel
            </Heading>
            <Text fontSize="sm" color="gray.600" maxW="md">
              Tournez la roue pour découvrir votre gain ! Cliquez sur 'Lancer'
              et attendez que la roue s'arrête.
            </Text>
          </VStack>
          {!isLoading && (
            <Wheel
              onReward={rewardHandler}
              primaryColor={shop?.gameColor1}
              secondaryColor={shop?.gameColor2}
            />
          )}
          <FortuneResultModal
            reward={reward}
            isOpen={isOpen}
            onClose={onClose}
          />
        </VStack>
      </Container>
    </Box>
  );
};

const getAdjustedColor = (color) => {
  const tc = tinycolor(color);

  if (tc.isValid() && tc.isLight()) {
    return tc.darken(30).toString(); // darken by 30%
  }

  return color;
};

export default FortuneWheel;
