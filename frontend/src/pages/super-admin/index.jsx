import { useLogout } from "@/hooks";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/Logo";
import Games from "./components/Games";
import Actions from "./components/actions";
import Admins from "./components/admins";

import { Flex, Box, Button, Heading } from "@chakra-ui/react";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box w="100%">
      <Flex
        justify="space-between"
        align="center"
        w="100%"
        py={2}
        px={4}
        bg="surface.navigation"
        shadow="md"
      >
        <Logo h="100px" w="unset" objectFit="unset" />
        <Button
          colorScheme="primary"
          variant="outline"
          type="button"
          size="sm"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Flex>
      <Box p={4} py={8}>
        <Heading size="lg">Super Admin Home</Heading>

        <Flex direction="column" gap={8} py={8}>
          <Heading size="md">Admins List</Heading>

          <Admins />

          <Heading size="md">Actions List</Heading>

          <Actions />

          <Games />
        </Flex>
      </Box>
    </Box>
  );
};

export default SuperAdmin;
