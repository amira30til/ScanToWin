import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { createActionSchema } from "@/schemas/action/createAction";
import { createAction } from "@/services/actionService";

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
  Select,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { ERROR_MESSAGES } from "@/constants";

const CreateActionModal = ({ isOpen, onClose, size = "md" }) => {
  const { t } = useTranslation();
  const ACTIONS = [
    t("actions.names.facebook"),
    t("actions.names.instagram"),
    t("actions.names.tiktok"),
    t("actions.names.google_reviews"),
  ];
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createActionSchema),
  });

  const onCreateActionSuccess = () => {
    queryClient.invalidateQueries("actions");
    reset();
    onClose();
    toast(t("create_action.success"), "success");
  };

  const onCreateActionError = (error) => {
    const errorMessages = {
      409: "create_action.error_already_exists",
    };

    const key = !error?.response
      ? ERROR_MESSAGES.NO_SERVER_RESPONSE
      : errorMessages[error.response?.status] ||
        "create_action.error_create_failed";

    const message = t(key);
    toast(message, "error");
  };

  const createActionMutation = useMutation({
    mutationFn: async (data) => await createAction(axiosPrivate, data),
    onSuccess: onCreateActionSuccess,
    onError: onCreateActionError,
  });

  const onSubmit = async (values) => {
    createActionMutation.mutate({ ...values, isActive: true });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{t("create_action.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel>{t("create_action.name_label")}</FormLabel>
              <Select
                bg="white"
                borderRadius="md"
                fontWeight="bold"
                focusBorderColor="primary.500"
                cursor="pointer"
                {...register("name")}
              >
                {ACTIONS?.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </Select>

              <FormHelperText color="red.500">
                {formState.errors.name?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              {t("create_action.close")}
            </Button>
            <Button type="submit" colorScheme="primary">
              {t("create_action.confirm")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateActionModal;
