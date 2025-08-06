import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";

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

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
const ACTIONS = ["Facebook", "Instagram", "Tiktok", "Avis Google"];

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
    toast(SUCCESS_MESSAGES.ACTION_CREATE_SUCCESS, "success");
  };

  const onCreateActionError = (error) => {
    const errorMessages = {
      409: ERROR_MESSAGES.ACTION_ALREADY_EXISTS,
    };

    const message = !error?.response
      ? ERROR_MESSAGES.NO_SERVER_RESPONSE
      : errorMessages[error.response?.status] ||
        ERROR_MESSAGES.ACTION_CREATE_FAILED;

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
        <ModalHeader>Create an Action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
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
              Close
            </Button>
            <Button type="submit" colorScheme="primary">
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateActionModal;
