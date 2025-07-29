import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getShopUsers } from "@/services/userService";
import { getGames } from "@/services/gameService";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

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
  Spinner,
} from "@chakra-ui/react";
import Error from "@/components/Error";

const HEADERS = [
  "Name",
  "email",
  "phone",
  "last played at",
  "favorite game",
  "times played",
];

const Users = () => {
  const { shopId } = useParams();

  const {
    data: users,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useQuery({
    queryKey: ["shop-users", shopId],
    queryFn: async () => {
      const response = await getShopUsers(shopId);
      return response.data.data.users;
    },
    enabled: !!shopId,
  });

  const { data: games } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames();
      return response.data.data.games;
    },
  });

  if (usersIsError) return <Error />;

  return (
    <Box pos="relative">
      <HeaderAdmin title="Users" />
      <Flex direction="column" gap={10} px={8} py={10} overflow-x="hidden">
        {usersIsLoading && <Spinner color="secondary.500" />}
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
              {games &&
                users?.map((user, index) => {
                  const formattedDate = format(
                    parseISO(user.lastPlayedAt),
                    "MMMM d, yyyy",
                    {
                      locale: fr,
                    },
                  );
                  const gameName = games?.find(
                    (game) => game.id === user.favoriteGameId,
                  ).name;
                  return (
                    <Tr key={index} fontSize="xs">
                      <>
                        <Td>
                          {user.firstName} {user.lastName}
                        </Td>
                        <Td>{user.email}</Td>
                        <Td>{user.tel}</Td>
                        <Td>{formattedDate}</Td>
                        <Td>{gameName}</Td>
                        <Td>{user.totalPlayCount}</Td>
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
