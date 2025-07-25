import React from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const LayoutSuperAdmin = () => {
  return (
    <Flex w="100%">
      <Outlet />
    </Flex>
  );
};

export default LayoutSuperAdmin;
