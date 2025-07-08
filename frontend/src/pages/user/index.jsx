import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getShopGameAssignement } from "@/services/adminService";

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
import { useEffect } from "react";

const FORTUNE_WHEEL_ID = "c7fac82a-24e7-4a44-b1a0-b337faf37bd5";

const Play = () => {
  const { shopId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: activeGame, error } = useQuery({
    queryKey: ["shop-game-assignment", shopId],
    queryFn: async () => {
      const response = await getShopGameAssignement(shopId);
      return response.data.data.data;
    },
    enabled: !!shopId,
  });

  useEffect(() => {
    // TODO
    // fetch user by "userId" and "shopId"
    // if user can win -> nothing
    // if you got error.response.data.code === "USER_COOLDOWN"
    // -> show the modal + timestamp
    onOpen();
  }, []);

  if (error) return <Error />;

  return (
    <>
      {activeGame?.gameId === FORTUNE_WHEEL_ID && <FortuneWheel />}
      <UserCooldownModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const UserCooldownModal = ({ isOpen, onClose }) => {
  return (
    <>
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
                  Timestamp
                </Text>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </>
  );
};

export default Play;
