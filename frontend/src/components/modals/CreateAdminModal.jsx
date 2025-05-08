// HOOKS
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";

// FUNCTIONS
import { yupResolver } from "@hookform/resolvers/yup";
import { createAdminValidator } from "@/validators/createAdminValidator";
import { createAdmin } from "@/services/superAdminService";

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

const CreateAdminModal = ({ isOpen, onClose, size = "md" }) => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createAdminValidator),
  });

  const createAdminMutation = useMutation({
    mutationFn: async (data) => await createAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      reset();
      onClose();
      toast("Admin created successfully", "success");
    },
    onError: () => toast("Failed to create admin", "error"),
  });

  const onSubmit = async (values) => {
    createAdminMutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Create an Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>

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

export default CreateAdminModal;
