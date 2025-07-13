import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCountdown, useLocalStorage } from "@/hooks";

import { getShopGameAssignement } from "@/services/adminService";
import { verifyUserCooldown } from "@/services/userService";

import FortuneWheel from "./FortuneWheel";
import Error from "@/components/Error";

import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const FORTUNE_WHEEL_ID = "c7fac82a-24e7-4a44-b1a0-b337faf37bd5";

const Play = () => {
  const { shopId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId] = useLocalStorage("s2w_user_id");

  const { data: activeGame, error } = useQuery({
    queryKey: ["shop-game-assignment", shopId],
    queryFn: async () => {
      const response = await getShopGameAssignement(shopId);
      return response.data.data.data;
    },
    enabled: !!shopId,
  });

  const { data: userVerify, isLoading } = useQuery({
    queryKey: ["verify-user-cooldown", shopId, userId],
    queryFn: async () => {
      const response = await verifyUserCooldown(userId, shopId);
      return response.data;
    },
    enabled: !!shopId && !!userId,
  });

  useEffect(() => {
    if (userVerify?.code === "COOLDOWN") {
      onOpen();
    }
  }, [userVerify]);

  if (error) return <Error />;

  return (
    <>
      {activeGame?.gameId === FORTUNE_WHEEL_ID && <FortuneWheel />}
      {!isLoading && userVerify?.timestamp && (
        <UserCooldownModal
          isOpen={isOpen}
          onClose={onClose}
          timestamp={userVerify.timestamp}
        />
      )}
    </>
  );
};

const UserCooldownModal = ({ isOpen, onClose, timestamp }) => {
  const { hours, minutes, seconds } = useCountdown(timestamp);

  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            You have already played today!
          </ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={2}>
              <Text textAlign="center">you can play again in</Text>
              <Text py={2} textAlign="center">
                {hours > 0 && `${hours}h `}
                {minutes > 0 && `${minutes}m `}
                {seconds}s
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Portal>
  );
};

export default Play;
