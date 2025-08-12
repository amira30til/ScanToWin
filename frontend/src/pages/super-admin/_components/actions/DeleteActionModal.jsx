import { useAxiosPrivate } from "@/hooks";
import { useMutation } from "@tanstack/react-query";

import { deleteAction } from "@/services/actionService";

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
  Box,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const DeleteActionModal = ({ isOpen, onClose, actionId, refetch }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();

  const deleteActionMutation = useMutation({
    mutationFn: async (actionId) => await deleteAction(axiosPrivate, actionId),
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const deleteActionHandler = () => {
    if (!!actionId) {
      deleteActionMutation.mutate(actionId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("delete_action.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>{t("delete_action.confirmation_message")}</Text>
            <Text>{t("delete_action.warning_message")}</Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("buttons.close")}
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteActionHandler}
              isLoading={deleteActionMutation.isPending}
            >
              {t("buttons.delete")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteActionModal;
