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

const DeleteActionModal = ({ isOpen, onClose, actionId, refetch }) => {
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
        <ModalHeader>Delete a action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>Are you sure you want to delete this action?</Text>
            <Text>
              Admin's chosen actions and all related data will be permanently
              deleted
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteActionHandler}
              isLoading={deleteActionMutation.isPending}
            >
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteActionModal;
