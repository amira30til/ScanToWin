import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import ComingSoonImg from "@/assets/coming-soon.svg";
import { useNavigate, useParams } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const tryAgainHandler = async () => {
    navigate(`/user/${shopId}`);
  };

  return (
    <Flex
      bg="#fff"
      h="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={10}
    >
      <Image boxSize="400px" src={ComingSoonImg} alt="Dan Abramov" />
      <Heading size="md" textAlign="center">
        The game is coming soon!
      </Heading>
      <Button colorScheme="primary" onClick={tryAgainHandler}>
        Try Again!
      </Button>
    </Flex>
  );
};

export default ComingSoon;
