import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCountdown, useLocalStorage } from "@/hooks";
import { useParams } from "react-router-dom";

import { verifyUserCooldown } from "@/services/userService";

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

const UserCooldownModal = ({ title, description }) => {
  const { shopId } = useParams();

  const { isOpen, onOpen } = useDisclosure();
  const [storedUserId] = useLocalStorage("s2w_user_id");
  const { userId: paramUserId } = useParams();

  const userId = storedUserId || paramUserId || null;

  const { data: userVerify, isLoading } = useQuery({
    queryKey: ["verify-user-cooldown", shopId, userId],
    queryFn: async () => {
      const response = await verifyUserCooldown(userId, shopId);
      return response.data;
    },
    enabled: !!shopId && !!userId,
  });

  const { hours, minutes, seconds } = useCountdown(userVerify?.timestamp);

  useEffect(() => {
    if (userVerify?.code === "COOLDOWN") {
      onOpen();
    }
  }, [userVerify]);

  return (
    <Portal>
      {!isLoading && userVerify?.timestamp && (
        <Modal isOpen={isOpen} size="xs" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">{title}</ModalHeader>
            <ModalBody>
              <Flex direction="column" gap={2}>
                <Text textAlign="center">{description}</Text>
                <Text py={2} textAlign="center">
                  {hours > 0 && `${hours}h `}
                  {minutes > 0 && `${minutes}m `}
                  {seconds}s
                </Text>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Portal>
  );
};

export default UserCooldownModal;
