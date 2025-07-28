import { useQuery } from "@tanstack/react-query";

import HeaderAdmin from "@/components/nav/HeaderAdmin";

import {
  Flex,
  Td,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Table,
  Box,
} from "@chakra-ui/react";

const HEADERS = ["Order", "Action", "link", "actions"];

const Users = () => {
  // const { data: shop } = useQuery({
  //   queryKey: ["shop-by-id", shopId],
  //   queryFn: async () => {
  //     const response = await getShop(shopId);
  //     return response.data.data.shop;
  //   },
  //   enabled: !!shopId,
  // });

  return (
    <Box pos="relative">
      <HeaderAdmin title="Users" />
      <Flex direction="column" gap={10} px={8} py={10} overflow-x="hidden">
        <TableContainer
          border="1px"
          borderColor="gray.300"
          minHeight="350px"
          bg="surface.navigation"
          fontSize="xs"
        >
          <Table variant="simple">
            <Thead bg="primary.100">
              <Tr>
                {HEADERS?.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {[].map((user, index) => {
                return (
                  <Tr key={index} fontSize="xs">
                    <>
                      <Td></Td>

                      <Td></Td>

                      <Td></Td>
                    </>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
};

export default Users;
