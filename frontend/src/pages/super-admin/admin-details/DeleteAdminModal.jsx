import { useAxiosPrivate } from "@/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { deleteAdmin } from "@/services/adminService";

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
import { useNavigate, useParams } from "react-router-dom";

const DeleteAdminModal = ({ isOpen, onClose, refetch }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const { adminId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteGameMutation = useMutation({
    mutationFn: async (adminId) => await deleteAdmin(axiosPrivate, adminId),
    onSuccess: async () => {
      await queryClient.refetchQueries(["admins"]);
      refetch();
      onClose();
      navigate("/super-admin/");
    },
  });

  const deleteGameHandler = () => {
    if (!!adminId) {
      console.log("adminId", adminId);
      deleteGameMutation.mutate(adminId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("delete_admin_modal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            dangerouslySetInnerHTML={{ __html: t("delete_admin_modal.body") }}
          />
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("delete_admin_modal.buttons.close")}
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteGameHandler}
              isLoading={deleteGameMutation.isPending}
            >
              {t("delete_admin_modal.buttons.delete")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAdminModal;
