import { useAxiosPrivate } from "@/hooks";
import { useMutation } from "@tanstack/react-query";

import { deleteShop } from "@/services/shopService";

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

const DeleteShopModal = ({ isOpen, onClose, shopId, refetch }) => {
  const axiosPrivate = useAxiosPrivate();

  const deleteShopMutation = useMutation({
    mutationFn: async (shopId) => await deleteShop(axiosPrivate, shopId),
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const deleteShopHandler = () => {
    if (!!shopId) {
      deleteShopMutation.mutate(shopId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete a shop</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this shop?</ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteShopHandler}
              isLoading={deleteShopMutation.isPending}
            >
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteShopModal;
