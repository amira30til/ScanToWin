import { useNavigate } from "react-router-dom";
import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import ErrorImg from "@/assets/error.svg";

const Error = ({ title = "Sorry! An Unexpected error occured!" }) => {
  const navigate = useNavigate();
  return (
    <Flex
      bg="#fff"
      h="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={10}
    >
      <Image boxSize="400px" src={ErrorImg} alt="Dan Abramov" />
      <Heading size="md" textAlign="center">
        {title}
      </Heading>
      <Button
        size="sm"
        colorScheme="primary"
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => navigate("/")}
      >
        Return to the home page
      </Button>
    </Flex>
  );
};

export default Error;
