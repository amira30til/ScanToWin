import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast, useCountdown, useLocalStorage } from "@/hooks";
import { useParams } from "react-router-dom";

import { createUser } from "@/services/userService";

import {
  Box,
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import { submitUserDataSchema } from "@/schemas/submitUserData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

// Import useTranslation hook
import { useTranslation } from "react-i18next";

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

const FortuneResultModal = ({ reward, onClose, isOpen, currentAction }) => {
  const { t } = useTranslation(); // Initialize translation hook

  const { shopId } = useParams();
  const toast = useToast();
  const [timestamp, setTimestamp] = useState();
  const [_, setUserId] = useLocalStorage("s2w_user_id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(submitUserDataSchema),
  });

  const onCreateUserError = () => {
    toast(t("error.failedCreateUser"), "error");
  };

  const onCreateUserSuccess = (data) => {
    const user = data?.data?.data?.user;
    const timestamp = data?.data?.error?.timestamp;
    if (timestamp && data?.data?.error?.code === "USER_COOLDOWN") {
      setTimestamp(timestamp);
      setUserId(data?.data?.error?.userId);
      toast(t("errors.alreadyPlayed"), "error");
      return;
    } else {
      toast(t("succes.rewardSentEmail"), "success");
    }
    if (user?.id) setUserId(user.id);
  };

  const { mutate: mutateCreateUser, isPending: isPendingCreateUser } =
    useMutation({
      mutationFn: async (values) => await createUser(values),
      onError: onCreateUserError,
      onSuccess: onCreateUserSuccess,
    });

  const onSubmit = (values) => {
    mutateCreateUser({
      ...values,
      shopId,
      rewardId: reward?.id,
      actionId: currentAction?.id,
    });
    reset();
    onClose();
  };

  return (
    <>
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
            {t("modals.youWonReward", { rewardName: reward?.name })}
          </ModalHeader>
          <ModalBody>
            <Text pb={2} fontSize="sm" align="center" color="gray.500">
              {t("modals.enterEmailForReward")}
            </Text>

            <Flex direction="column" gap={2}>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">
                  {t("form.firstName")}
                </FormLabel>
                <Input
                  focusBorderColor="primary.500"
                  placeholder={t("form.yourFirstName")}
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
                  {t("form.lastName")}
                </FormLabel>
                <Input
                  focusBorderColor="primary.500"
                  placeholder={t("form.yourLastName")}
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
                  {t("form.email")}
                </FormLabel>
                <Input
                  focusBorderColor="primary.500"
                  type="email"
                  placeholder={t("form.email")}
                  size="sm"
                  {...register("email")}
                />

                <FormHelperText color="red.500">
                  {errors.email?.message}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">
                  {t("form.phone")}
                </FormLabel>
                <Input
                  focusBorderColor="primary.500"
                  type="tel"
                  placeholder={t("form.yourPhone")}
                  size="sm"
                  {...register("tel")}
                />

                <FormHelperText color="red.500">
                  {errors.tel?.message}
                </FormHelperText>
              </FormControl>

              <Checkbox
                {...register("agreeToPromotions")}
                colorScheme="primary"
              >
                <Text fontSize="xs">{t("form.agreePromotions")}</Text>
              </Checkbox>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex justify="center" w="100%">
              <Button
                type="submit"
                colorScheme="primary"
                isLoading={isPendingCreateUser}
              >
                {t("buttons.confirm")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {timestamp && <CooldownTimer targetTimestamp={timestamp} />}
    </>
  );
};

function CooldownTimer({ targetTimestamp }) {
  const { t } = useTranslation();
  const { hours, minutes, seconds, expired } = useCountdown(targetTimestamp);

  if (expired) return <span>{t("cooldown.nowCanPlay")}</span>;

  return (
    <Alert status="info" mb={2}>
      <AlertIcon />
      <Box w="full" textAlign="start">
        <AlertTitle>{t("cooldown.alreadyPlayedTitle")}</AlertTitle>
        <AlertDescription>
          {t("cooldown.canPlayAgainIn")} {hours > 0 && `${hours}h `}
          {minutes > 0 && `${minutes}m `}
          {seconds}s
        </AlertDescription>
      </Box>
    </Alert>
  );
}

export default FortuneResultModal;
