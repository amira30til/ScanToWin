import { useAxiosPrivate } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <ModalHeader>{t("delete_shop_modal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t("delete_shop_modal.body")}</ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("delete_shop_modal.buttons.close")}
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteShopHandler}
              isLoading={deleteShopMutation.isPending}
            >
              {t("delete_shop_modal.buttons.delete")}{" "}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteShopModal;
