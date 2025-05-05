import {
  Flex,
  InputGroup,
  InputLeftElement,
  Avatar,
  Input,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

const AdminDashboard = () => {
  return (
    <>
      <Flex justify="space-between">
        <InputGroup
          w="96"
          display={{
            base: "none",
            md: "flex",
          }}
        >
          <InputLeftElement color="gray.500">
            <FiSearch />
          </InputLeftElement>
          <Input placeholder="Search for articles..." />
        </InputGroup>

        <Flex align="center">
          <Icon color="gray.500" as={FaBell} cursor="pointer" />
          <Avatar
            ml="4"
            size="sm"
            name="anubra266"
            src="https://avatars.githubusercontent.com/u/30869823?v=4"
            cursor="pointer"
          />
        </Flex>
      </Flex>
    </>
  );
};

export default AdminDashboard;
