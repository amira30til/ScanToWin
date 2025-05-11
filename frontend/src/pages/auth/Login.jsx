// HOOKS
import { useEffect } from "react";
import { useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// FUNCTIONS
import { loginUser, forgotPassword } from "@/services/authService";
import { loginValidator } from "@/validators/loginValidator";
import { yupResolver } from "@hookform/resolvers/yup";

// COMPONENTS
import Logo from "@/components/Logo";

// STYLE
import {
  Flex,
  Heading,
  Input,
  Button,
  Text,
  Image,
  InputGroup,
  InputRightElement,
  Icon,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";

// ASSETS
import { AiOutlineMail } from "react-icons/ai";
import loginImg from "@/assets/login.svg";
import PasswordInput from "@/components/common/PasswordInput";
import { MdOutlineMail } from "react-icons/md";
import { ERROR_MESSAGES } from "@/constants";

const Login = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const auth = useAuthStore((state) => state.auth);

  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState, watch } = useForm({
    resolver: yupResolver(loginValidator),
  });

  const email = watch("email");

  const roleBasedRedirect = (role) => {
    let userRole = "";
    if (role === "ADMIN") {
      userRole = "admin";
    } else if (role === "SUPER_ADMIN") {
      userRole = "super-admin";
    }
    navigate(`/${userRole}`, { replace: true });
  };

  const onSubmit = async (values) => {
    loginMutation.mutate(values);
  };

  const onLoginSuccess = (response, variables) => {
    const accessToken = response?.data?.accessToken;
    const role = response?.data?.user?.role;

    setAuth({ ...variables, role, accessToken });
    roleBasedRedirect(role);
  };

  const onLoginError = (error) => {
    const errorMessages = {
      400: ERROR_MESSAGES.AUTH_EMAIL_PASSWORD_MISSING,
      401: ERROR_MESSAGES.AUTH_UNAUTHORIZED,
      404: ERROR_MESSAGES.AUTH_EMAIL_NOT_FOUND,
    };

    const message = !error?.response
      ? ERROR_MESSAGES.NO_SERVER_RESPONSE
      : errorMessages[error.response?.status] ||
        ERROR_MESSAGES.AUTH_LOGIN_FAILED;

    toast(message, "error");
  };

  const loginMutation = useMutation({
    mutationFn: async (data) => await loginUser(data),
    onSuccess: onLoginSuccess,
    onError: onLoginError,
  });

  const forgotPasswordHandler = async () => {
    const isValidEmail = !formState?.errors?.email && email !== "";
    if (isValidEmail) {
      forgotPasswordMutation.mutate(email);
    } else {
      toast("Invalid email", "error");
    }
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data) => await forgotPassword(data),
    onSuccess: () => navigate("/reset-password", { state: { email } }),
    onError: () => toast("Failed to send forgot password email", "error"),
  });

  useEffect(() => {
    if (auth?.accessToken) {
      roleBasedRedirect(auth?.role);
    }
  }, [auth, navigate]);

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
              Welcome Back!
            </Heading>
            <Text
              color="darkgray"
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
            >
              Login to access the platform
            </Text>
          </Flex>

          <Flex w="100%" direction="column" alignItems="end" gap={2}>
            <FormControl isInvalid={formState?.errors?.email}>
              <InputGroup>
                <Input
                  focusBorderColor="primary.500"
                  type="email"
                  placeholder="Enter your email"
                  autoFocus
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

            <FormControl isInvalid={formState?.errors?.password}>
              <PasswordInput
                size="lg"
                focusBorderColor="primary.500"
                {...register("password")}
              />
              <FormErrorMessage>
                {formState?.errors?.password?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              variant="link"
              colorScheme="primary"
              onClick={forgotPasswordHandler}
              isLoading={forgotPasswordMutation.isPending}
              pt={2}
              pb={4}
            >
              Forgot your password?
            </Button>

            <Button
              type="submit"
              w="100%"
              leftIcon={<AiOutlineMail />}
              isDisabled={Object.keys(formState.errors).length > 0}
              isLoading={loginMutation.isPending}
              colorScheme="primary"
              size="lg"
            >
              Login
            </Button>
          </Flex>
        </Flex>
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
  );
};

export default Login;
