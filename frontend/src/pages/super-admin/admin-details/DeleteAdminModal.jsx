import { useAxiosPrivate } from "@/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        <ModalHeader>Delete an admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this admin? <br></br> All shops,
          rewards, actions related to this admin will be permanently deleted
        </ModalBody>
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

export default DeleteAdminModal;
