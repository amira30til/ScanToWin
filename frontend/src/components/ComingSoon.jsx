import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import ComingSoonImg from "@/assets/coming-soon.svg";
import { useNavigate, useParams } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
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
      <Button colorScheme="primary" onClick={() => navigate(`/play/${shopId}`)}>
        Try Again!
      </Button>
    </Flex>
  );
};

export default ComingSoon;
