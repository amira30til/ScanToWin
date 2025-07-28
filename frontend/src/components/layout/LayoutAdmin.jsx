import useAuthStore from "@/store";
import { useAdminRedirect } from "@/hooks";
import { useToken } from "@chakra-ui/react";

import { decodeToken } from "@/utils/auth";

import SideBar from "@/components/nav/Sidebar";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import { Outlet } from "react-router-dom";

import { Flex, Box } from "@chakra-ui/react";

const LayoutAdmin = () => {
  const auth = useAuthStore((state) => state.auth);
  let adminId = decodeToken(auth?.accessToken);
  const [sidebarWidth] = useToken("sizes", ["sidebar"]);
  const [headerMobileHeight] = useToken("sizes", ["header.mobile"]);
  const [headerWebHeight] = useToken("sizes", ["header.web"]);

  const { isLoading, error, shops } = useAdminRedirect(adminId);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <Flex w="100%" overflow="hidden">
      <SideBar shops={shops}>
        <Box
          w={{ sm: "100vw", md: `calc(100vw - ${sidebarWidth})` }}
          minH={{
            sm: `calc(100vh - ${headerMobileHeight})`,
            md: `calc(100vh - ${headerWebHeight})`,
          }}
          mt={{ sm: "header.mobile", md: "header.web" }}
        >
          <Outlet />
        </Box>
      </SideBar>
    </Flex>
  );
};

export default LayoutAdmin;
