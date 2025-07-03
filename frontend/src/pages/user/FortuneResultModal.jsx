import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { createUser } from "@/services/userService";

import {
  ModalFooter,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  HStack,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import { submitUserDataValidator } from "@/validators/submitUserDataValidator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";

const celebrate = keyframes`
  0%   { transform: scale(0.95); opacity: 0; }
  25%  { transform: scale(1.05); opacity: 1; }
  50%  { transform: scale(0.98); }
  75%  { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const FortuneResultModal = ({ rewardId, onClose, isOpen }) => {
  const { shopId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(submitUserDataValidator),
  });

  const createUserMutation = useMutation({
    mutationFn: async (values) => await createUser(values),
    onError: (error) => console.error(error),
    onSuccess: () => console.log("success"),
  });

  const onSubmit = (values) => {
    console.log({ ...values, shopId, rewardId });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      onClose={onClose}
      isCentered
      p={6}
      bg="white"
      borderRadius="xl"
      borderWidth="2px"
      borderColor="primary.100"
      boxShadow="lg"
      maxW="md"
      mx="auto"
    >
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        animation={isOpen ? `${celebrate} 0.8s ease-out forwards` : "none"}
        opacity={isOpen ? 1 : 0}
      >
        <HStack mt={6} justify="center" gap={1}>
          {[...Array(3)].map((_, i) => (
            <Text
              key={i}
              fontSize="2xl"
              color="fortune.yellow"
              css={{
                animation: `${float} 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              🎁
            </Text>
          ))}
        </HStack>
        <ModalHeader align="center" pb="0">
          You Won a {rewardId}!
        </ModalHeader>
        <ModalBody>
          <Text pb={2} fontSize="sm" align="center" color="gray.500">
            Please enter your email so you can have the reward!
          </Text>

          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                First Name
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                placeholder="your first name"
                autoFocus
                size="sm"
                {...register("firstName")}
              />

              <FormHelperText color="red.500">
                {errors.firstName?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Last Name
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                placeholder="your last name"
                autoFocus
                size="sm"
                {...register("lastName")}
              />

              <FormHelperText color="red.500">
                {errors.lastName?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Email
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="email"
                placeholder="email"
                size="sm"
                {...register("email")}
              />

              <FormHelperText color="red.500">
                {errors.email?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Phone
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="tel"
                placeholder="your phone number"
                size="sm"
                {...register("tel")}
              />

              <FormHelperText color="red.500">
                {errors.tel?.message}
              </FormHelperText>
            </FormControl>

            <Checkbox {...register("agreeToPromotions")} colorScheme="primary">
              <Text fontSize="xs">
                I agree to receive personalised communications about promotions
                and new products and from the store.
              </Text>
            </Checkbox>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex justify="center" w="100%">
            <Button type="submit" colorScheme="primary">
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FortuneResultModal;
