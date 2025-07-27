import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks";

import { getActionsByShop, chosenActionClick } from "@/services/actionService";
import tinycolor from "tinycolor2";

import Wheel from "./wheel";
import FortuneResultModal from "./FortuneResultModal";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Portal,
  ModalFooter,
  useDisclosure,
  Link,
} from "@chakra-ui/react";

import FacebookSvg from "@/assets/components/FacebookSvg";
import GoogleSvg from "@/assets/components/GoogleSvg";
import InstagramSvg from "@/assets/components/InstagramSvg";
import TiktokSvg from "@/assets/components/TiktokSvg";
import logo from "@/assets/logo.png";

const FortuneWheel = ({ shop }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const {
    isOpen: isActionOpen,
    onOpen: onActionOpen,
    onClose: onActionClose,
  } = useDisclosure();
  const [actionPosition, setActionPosition] = useLocalStorage(
    "s2w_action_position",
  );

  const [reward, setReward] = useState(null);
  const [showAction, setShowAction] = useState(true);
  const [currentAction, setCurrentAction] = useState();
  const { shopId } = useParams();

  const { data: actionsByShop } = useQuery({
    queryKey: ["actions-by-shop", shopId],
    queryFn: async () => {
      const response = await getActionsByShop(shopId);
      return response.data.data.chosenActions;
    },
    enabled: !!shopId,
  });

  const rewardHandler = (reward) => {
    console.log("setReward", reward);
    setReward(reward);
    onOpen();
  };

  const onActionHandler = () => {
    let pos = +actionPosition || 1;
    const currentAction = actionsByShop.find(
      (action) => action.position === pos,
    );
    setCurrentAction(currentAction);
    setShowAction(false);
    onActionOpen();
  };

  useEffect(() => {
    if (actionsByShop !== undefined && actionsByShop.length < 1) {
      navigate(`/play/${shopId}/coming-soon`);
    }
  }, [actionsByShop]);

  return (
    <>
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
                src={shop?.logo ?? logo}
                alt="logo"
                h="auto"
                w="80px"
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
            <Box position="relative" display="inline-block">
              <Wheel
                onReward={rewardHandler}
                primaryColor={shop?.gameColor1}
                secondaryColor={shop?.gameColor2}
              />

              {showAction && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  zIndex={10}
                  onClick={onActionHandler}
                />
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
      <FortuneResultModal
        reward={reward}
        isOpen={isOpen}
        onClose={onClose}
        currentAction={currentAction}
      />
      <ActionModal
        isOpen={isActionOpen}
        onClose={onActionClose}
        setActionPosition={setActionPosition}
        actionPosition={actionPosition}
        actionsLength={actionsByShop?.length || 0}
        currentAction={currentAction}
      />
    </>
  );
};

const ActionModal = ({
  isOpen,
  onClose,
  setActionPosition,
  actionPosition,
  actionsLength,
  currentAction,
}) => {
  const chosenActionClickMutation = useMutation({
    mutationFn: async (values) => await chosenActionClick(values.id),
  });

  const onActionLinkHandler = () => {
    const current = +actionPosition || 1;

    if (current >= actionsLength) {
      setActionPosition(1);
    } else {
      setActionPosition(current + 1);
    }

    chosenActionClickMutation.mutate({ id: currentAction.id });

    onClose();
  };

  const getActionContent = (name) => {
    switch (name) {
      case "Avis Google":
        return {
          description: "Leave a review on google!",
          buttonText: "Review",
          icon: <GoogleSvg />,
        };
      case "Facebook":
        return {
          description: "Like our Facebook page!",
          buttonText: "Like",
          icon: <FacebookSvg />,
        };
      case "Instagram":
        return {
          description: "Follow us on Instagram",
          buttonText: "Follow",
          icon: <InstagramSvg />,
        };
      case "Tiktok":
        return {
          description: "Follow us on Tiktok!",
          buttonText: "Follow",
          icon: <TiktokSvg />,
        };
      default:
        return {
          description: "Action content goes here",
          buttonText: "Follow",
          icon: null,
        };
    }
  };

  const { description, buttonText, icon } = getActionContent(
    currentAction?.name,
  );

  return (
    <Portal>
      <Modal isOpen={isOpen} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Flex align="center" justify="center" gap={2}>
              {icon}
              {currentAction?.name}
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex justifyContent="center">{description}</Flex>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              as={Link}
              target="_blank"
              href={currentAction?.targetLink}
              colorScheme="primary"
              onClick={onActionLinkHandler}
            >
              {buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
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
