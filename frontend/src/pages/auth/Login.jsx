// HOOKS
import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { useNavigate, NavLink } from "react-router-dom";
import useAuthStore from "@/store";

// FUNCTIONS
import { loginUser } from "@/services/authService";

// COMPONENTS
import Logo from "@/components/Logo";

// STYLE
import {
  Flex,
  Heading,
  Input,
  Button,
  Link,
  Text,
  Image,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";

// ASSETS
import { AiOutlineMail } from "react-icons/ai";
import loginImg from "@/assets/login.svg";
import PasswordInput from "@/components/common/PasswordInput";
import { MdOutlineMail } from "react-icons/md";

const Login = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const auth = useAuthStore((state) => state.auth);

  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roleBasedRedirect = (role) => {
    let userRole = "";
    if (role === "ADMIN") {
      userRole = "admin";
    } else if (role === "SUPER_ADMIN") {
      userRole = "super-admin";
    }
    navigate(`/${userRole}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.user?.role;
      setAuth({ email, password, role, accessToken });
      roleBasedRedirect(role);
    } catch (error) {
      if (!error?.response) {
        toast("No Server Response", "error");
      } else if (error.response?.status === 400) {
        toast("Missing Email or Password", "error");
      } else if (error.response?.status === 401) {
        toast("Unauthorized", "error");
      } else {
        toast("Login Failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

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
          onSubmit={handleSubmit}
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
            <InputGroup>
              <Input
                focusBorderColor="primary.500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                autoFocus
                size="lg"
              />
              <InputRightElement width="4.5rem">
                <Icon h="100%" as={MdOutlineMail} color="#000" />
              </InputRightElement>
            </InputGroup>

            <PasswordInput
              size="lg"
              focusBorderColor="primary.500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link
              as={NavLink}
              to="/forgot-password"
              color="primary.500"
              _hover={{ textDecoration: "underline" }}
              fontSize="sm"
            >
              Forgot your password?
            </Link>

            <Link
              as={NavLink}
              to="/admin"
              color="primary.500"
              _hover={{ textDecoration: "underline" }}
              fontSize="sm"
            >
              ADMIN PAGE
            </Link>

            <Link
              as={NavLink}
              to="/super-admin"
              color="primary.500"
              _hover={{ textDecoration: "underline" }}
              fontSize="sm"
            >
              SUPER ADMIN PAGE
            </Link>

            <Button
              type="submit"
              w="100%"
              leftIcon={<AiOutlineMail />}
              isDisabled={!email || password.length < 6}
              isLoading={loading}
              colorScheme="primary"
              size="lg"
              _hover={{
                opacity: email && password.length >= 6 && 0.8,
              }}
            >
              Login
            </Button>
          </Flex>

          <Flex
            fontSize={{ base: "sm", md: "md" }}
            w="100%"
            justifyContent="center"
          >
            <Text color="gray" mr={1}>
              Don't have an account?
            </Text>
            <Link
              as={NavLink}
              to="/register"
              color="primary.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Register
            </Link>
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
