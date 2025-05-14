import SideBar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const LayoutAdmin = () => {
  return (
    <Flex w="100%">
      <SideBar>
        <div w="100%">
          <Outlet />
        </div>
      </SideBar>
    </Flex>
  );
};

export default LayoutAdmin;
