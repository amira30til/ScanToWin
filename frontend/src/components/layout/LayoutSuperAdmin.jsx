import { useLogout } from "@/hooks";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/Logo";

import { Outlet } from "react-router-dom";
import { Flex, Box, Button } from "@chakra-ui/react";

const LayoutSuperAdmin = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Flex w="100%">
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
        <Outlet />
      </Box>
    </Flex>
  );
};

export default LayoutSuperAdmin;
