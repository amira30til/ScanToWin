// HOOKS
import { useEffect } from "react";
import useAuthStore from "@/store";
import { useAdminRedirect } from "@/hooks";

// FUNCTIONS
import { decodeToken } from "@/utils/auth";

// COMPONENTS
import SideBar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import { Flex } from "@chakra-ui/react";

const LayoutAdmin = () => {
  const setFullShop = useAuthStore((state) => state.setShop);
  const auth = useAuthStore((state) => state.auth);
  let adminId = decodeToken(auth?.accessToken);

  const { isLoading, error, currentShop, shops } = useAdminRedirect(adminId);

  useEffect(() => {
    if (currentShop) {
      setFullShop(currentShop);
    }
  }, [currentShop]);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <Flex w="100%">
      <SideBar shops={shops}>
        <div>
          <Outlet />
        </div>
      </SideBar>
    </Flex>
  );
};

export default LayoutAdmin;
