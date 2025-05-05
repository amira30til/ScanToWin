// HOOKS
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useToast } from "@/hooks";

// FUNCTIONS
import { validateEmail } from "@/utils/helpers";
import { registerUser } from "@/services/authService";

//  COMPONENTS
import Logo from "@/components/Logo";

// STYLE
import { Flex, Input, Button, Heading, Text, Link } from "@chakra-ui/react";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error("Invalid Email");
      }

      const response = await registerUser({
        email,
        password,
      });

      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));

      navigate("/login");
    } catch (error) {
      if (!error?.response) {
        toast("Server not responding", "error");
      } else if (error.response?.status === 409) {
        toast("Email already exists", "error");
      } else {
        toast("Registration failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      w="325px"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
      onSubmit={handleSubmit}
    >
      <Flex cursor="pointer" onClick={() => navigate("/")}>
        <Logo w="280px" />
      </Flex>
      <Flex
        gap="6px"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="lg">Join Us Now!</Heading>
        <Text color="darkgray">Welcome! Please create your account</Text>
      </Flex>
      <Flex w="100%" direction="column" gap={2}>
        <Input
          focusBorderColor="primary.500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          autoFocus
          size="md"
          mt={2}
        />

        <Input
          focusBorderColor="primary.500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          size="md"
        />
        <Button
          type="submit"
          w="100%"
          isDisabled={!email || password.length < 6}
          isLoading={loading}
          colorScheme="primary"
          size="sm"
          _hover={{
            opacity: email && password.length >= 6 && "0.8",
          }}
        >
          Register
        </Button>
      </Flex>

      <Flex fontSize="sm">
        <Text color="gray" mr={1}>
          Already have an account?
        </Text>
        <Link
          as={NavLink}
          to="/login"
          color="primary.500"
          fontWeight="semibold"
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Link>
      </Flex>
    </Flex>
  );
};

export default Register;
