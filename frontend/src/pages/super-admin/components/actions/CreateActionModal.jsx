// HOOKS
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useTranslation } from "react-i18next";

// FUNCTIONS
import { yupResolver } from "@hookform/resolvers/yup";
import { createActionSchema } from "@/schemas/action/createAction";
import { createAction } from "@/services/actionService";

// STYLE
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
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

const CreateActionModal = ({ isOpen, onClose, size = "md" }) => {
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

  const errorMessages = {
    409: t("create_action.error_already_exists"),
  };

  const message = !error?.response
    ? ERROR_MESSAGES.NO_SERVER_RESPONSE
    : errorMessages[error.response?.status] ||
      t("create_action.error_create_failed");

  toast(message, "error");

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
              <Input
                focusBorderColor="primary.500"
                placeholder={t("create_action.name_placeholder")}
                autoFocus
                size="md"
                mt={2}
                {...register("name")}
              />

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
