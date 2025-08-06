import { useAxiosPrivate } from "@/hooks";
import { useMutation } from "@tanstack/react-query";

import { deleteGame } from "@/services/gameService";

import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const DeleteGameModal = ({ isOpen, onClose, gameId, refetch }) => {
  const axiosPrivate = useAxiosPrivate();

  const deleteGameMutation = useMutation({
    mutationFn: async (gameId) => await deleteGame(axiosPrivate, gameId),
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const deleteGameHandler = () => {
    if (!!gameId) {
      deleteGameMutation.mutate(gameId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete a game</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this game?</ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteGameHandler}
              isLoading={deleteGameMutation.isPending}
            >
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteGameModal;
