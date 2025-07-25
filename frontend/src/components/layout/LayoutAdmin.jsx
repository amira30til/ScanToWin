//
import useAuthStore from "@/store";
import { useAdminRedirect } from "@/hooks";

import { decodeToken } from "@/utils/auth";

import SideBar from "@/components/nav/Sidebar";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import { Flex, Box } from "@chakra-ui/react";

const LayoutAdmin = () => {
  const auth = useAuthStore((state) => state.auth);
  let adminId = decodeToken(auth?.accessToken);

  const { isLoading, error, shops } = useAdminRedirect(adminId);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <Flex w="100%">
      <SideBar shops={shops}>
        <Box w={{ sm: "100%", md: "calc(100vw - 259px)" }} minH="100vh">
          <Outlet />
        </Box>
      </SideBar>
    </Flex>
  );
};

export default LayoutAdmin;
