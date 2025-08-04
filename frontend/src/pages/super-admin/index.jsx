import Games from "./components/games";
import Actions from "./components/actions";
import Admins from "./components/admins";

import { Flex, Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";

const SuperAdmin = () => {
  return (
    <Box p={4} py={8}>
      <Heading size="lg">Super Admin Home</Heading>

      <Flex direction="column" gap={8} py={8}>
        <Heading size="md">Admins List</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Archived admins, won't be able to use their accounts, and the their
          games will be disabled
        </Alert>
        <Admins />

        <Heading size="md">Actions List</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Non active actions, won't be shown to the admins
        </Alert>
        <Actions />

        <Heading size="md">Games</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Archived games will be seen as "coming soon" to the admins
        </Alert>
        <Games />
      </Flex>
    </Box>
  );
};

export default SuperAdmin;
