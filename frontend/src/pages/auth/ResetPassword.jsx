// HOOKS
import { useState } from "react";
import { useToast } from "@/hooks";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
// FUNCTIONS
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/schemas/auth/resetPassword";
import { resetPassword } from "@/services/authService";

// COMPONENTS
import Logo from "@/components/Logo";
import PasswordInput from "@/components/common/PasswordInput";

// STYLE
import {
  Flex,
  Heading,
  Input,
  Button,
  Text,
  Image,
  InputGroup,
  Icon,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

// ASSETS
import loginImg from "@/assets/login.svg";
import { MdOutlineMail } from "react-icons/md";
import { LuShield } from "react-icons/lu";
import { ERROR_MESSAGES } from "@/constants";

const ResetPassword = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email ?? "";
  const [showAlert, setShowAlert] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromState,
      verificationCode: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values) => {
    resetMutation.mutate(values);
  };

  const onResetSuccess = () => {
    setShowAlert(true);
    reset();
  };

  const onResetError = (error) => {
    const message = !error?.response
      ? ERROR_MESSAGES.NO_SERVER_RESPONSE
      : ERROR_MESSAGES.AUTH_RESET_FAILED;

    toast(message, "error");
  };

  const resetMutation = useMutation({
    mutationFn: async (data) => await resetPassword(data),
    onSuccess: onResetSuccess,
    onError: onResetError,
  });

  return (
    <Flex
      justifyContent="space-evenly"
      alignItems="center"
      h="100vh"
      bg="white"
    >
      <Flex justifyContent="center" alignItems="center">
        <Flex
          as="form"
          w={{ base: "325px", md: "350px", lg: "450px" }}
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={12}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Flex cursor="pointer" onClick={() => navigate("/")}>
            <Logo w="120px" />
          </Flex>

          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={{ base: 2, md: 6 }}
          >
            <Heading size={{ base: "lg", md: "xl" }} textAlign="center">
              {t("reset_password.title")}
            </Heading>
            <Text
              color="darkgray"
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
            >
              {t("reset_password.subtitle")}
            </Text>
          </Flex>

          {showAlert ? (
            <PasswordResetSuccessAlert setShowAlert={setShowAlert} />
          ) : (
            <>
              <Flex w="100%" direction="column" alignItems="end" gap={2}>
                <FormControl isInvalid={formState?.errors?.email}>
                  <InputGroup>
                    <Input
                      focusBorderColor="primary.500"
                      type="email"
                      placeholder={t("reset_password.email_placeholder")}
                      size="lg"
                      {...register("email")}
                      _placeholder={{
                        fontSize: "md",
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Icon h="100%" as={MdOutlineMail} color="#000" />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {formState?.errors?.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formState?.errors?.verificationCode}>
                  <InputGroup>
                    <Input
                      focusBorderColor="primary.500"
                      placeholder={t("reset_password.code_placeholder")}
                      autoFocus
                      size="lg"
                      {...register("verificationCode")}
                      _placeholder={{
                        fontSize: "md",
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Icon h="100%" as={LuShield} color="#000" />
                    </InputRightElement>
                  </InputGroup>

                  <FormErrorMessage>
                    {formState?.errors?.verificationCode?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formState?.errors?.newPassword}>
                  <PasswordInput
                    size="lg"
                    focusBorderColor="primary.500"
                    placeholder={t("reset_password.password_placeholder")}
                    {...register("newPassword")}
                  />

                  <FormErrorMessage>
                    {formState?.errors?.newPassword?.message}
                  </FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  w="100%"
                  isDisabled={Object.keys(formState.errors).length > 0}
                  isLoading={resetMutation.isPending}
                  colorScheme="primary"
                  size="lg"
                >
                  {t("reset_password.submit")}
                </Button>
              </Flex>
              <Flex
                fontSize={{ base: "sm", md: "md" }}
                w="100%"
                justifyContent="center"
              >
                <Text color="gray" mr={1}>
                  {t("reset_password.remember_password")}
                </Text>
                <Button
                  as={NavLink}
                  to="/login"
                  variant="link"
                  colorScheme="primary"
                >
                  {t("reset_password.login")}
                </Button>
              </Flex>
            </>
          )}
        </Flex>
        <Flex
          h="90vh"
          w={{ base: 0, md: "40%", lg: "auto" }}
          justifyContent="center"
          display={{ base: "none", md: "flex" }}
        >
          <Image src={loginImg} alt="product image" />
        </Flex>
      </Flex>
    </Flex>
  );
};

const PasswordResetSuccessAlert = ({ setShowAlert }) => {
  return (
    <Alert status="success" borderRadius="md">
      <AlertIcon />
      <Flex direction="column">
        <AlertTitle fontWeight="semibold">
          {t("reset_password.success_title")}
        </AlertTitle>
        <AlertDescription>
          <Button
            as={NavLink}
            to="/login"
            fontWeight="bold"
            variant="link"
            color="primary.700"
            size="sm"
          >
            {t("reset_password.success_button")}
          </Button>
        </AlertDescription>
      </Flex>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => setShowAlert(false)}
      />
    </Alert>
  );
};

export default ResetPassword;
