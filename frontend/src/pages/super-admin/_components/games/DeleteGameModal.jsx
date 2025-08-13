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
import { useTranslation } from "react-i18next";
const DeleteGameModal = ({ isOpen, onClose, gameId, refetch }) => {
  const { t } = useTranslation();
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
        <ModalHeader>{t("delete_game_modal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t("delete_game_modal.confirmation")}</ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("delete_game_modal.close")}{" "}
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteGameHandler}
              isLoading={deleteGameMutation.isPending}
            >
              {t("delete_game_modal.delete")}{" "}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteGameModal;
