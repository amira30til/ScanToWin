import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";

import { yupResolver } from "@hookform/resolvers/yup";
import { createAdminSchema } from "@/schemas/createAdmin";
import { createAdmin } from "@/services/adminService";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Input,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

const CreateAdminModal = ({ isOpen, onClose, size = "md" }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createAdminSchema),
  });

  const onCreateAdminSuccess = () => {
    queryClient.invalidateQueries("admins");
    reset();
    onClose();
    toast(t("admin.modal.messages.success"), "success");
  };

  const onCreateAdminError = (error) => {
    const errorMessages = {
      409: t("admin.modal.messages.alreadyExists"),
    };

    const message = !error?.response
      ? t("admin.modal.messages.noServer")
      : errorMessages[error.response?.status] ||
        t("admin.modal.messages.createFailed");

    toast(message, "error");
  };

  const createAdminMutation = useMutation({
    mutationFn: async (data) => await createAdmin(axiosPrivate, data),
    onSuccess: onCreateAdminSuccess,
    onError: onCreateAdminError,
  });

  const onSubmit = async (values) => {
    createAdminMutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{t("admin.modal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel>{t("admin.modal.fields.email")}</FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="email"
                placeholder="email"
                autoFocus
                size="md"
                mt={2}
                {...register("email")}
              />
              <FormHelperText color="red.500">
                {formState.errors.email?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>{t("admin.modal.fields.password")}</FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="password"
                placeholder="password"
                size="md"
                {...register("password")}
              />
              <FormHelperText color="red.500">
                {formState.errors.password?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("admin.modal.buttons.close")}
            </Button>
            <Button type="submit" colorScheme="primary">
              {t("admin.modal.buttons.confirm")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdminModal;
