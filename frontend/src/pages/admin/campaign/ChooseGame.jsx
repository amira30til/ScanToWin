// HOOKS
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate, useToast } from "@/hooks";

// FUNCTIONS
import { getGames } from "@/services/adminService";

// COMPONENTS
import AdminSection from "@/components/common/AdminSection";

// STYLE
import {
  Flex,
  Text,
  Image,
  // useToken,
} from "@chakra-ui/react";

// ASSETS
import gameImg from "@/assets/game.jpeg";

const ChooseGame = () => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();

  const { data: games } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames(axiosPrivate);
      return response.data.data.games;
    },
    onError: () => toast("Failed to fetch games", "error"),
  });

  return (
    <AdminSection
      title="Game selection"
      description="Choose from 3 interactive games to engage your users and create a
  unique experience."
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={8}
      >
        {games?.map((game) => (
          <Game key={game.id} game={game} />
        ))}
      </Flex>
    </AdminSection>
  );
};

const Game = ({ game }) => {
  const borderColor = game.isActive ? "primary.500" : "gray.300";
  const border = game.isActive ? "2px" : "1px";

  return (
    <Flex
      direction="column"
      border={border}
      borderColor={borderColor}
      borderRadius="3xl"
      gap={6}
      p={8}
      // maxW="325px"
      // maxH="325px"
      justify="center"
      align="center"
      transition="all 0.1s ease-in-out"
      _hover={{
        borderColor: "primary.500",
        cursor: "pointer",
        transform: "translateY(-8px)",
        shadow: "xl",
        transition: "all 0.1s ease-in-out",
        bg: "white",
      }}
    >
      <Flex direction="column" gap={1} justify="center" align="center">
        <Text fontWeight="bold">{game.name}</Text>
        <Text fontSize="sm" color="gray">
          hard coded description hard coded description hard
        </Text>
      </Flex>
      <Image
        borderRadius="full"
        src={gameImg}
        // maxW="200px"
        // maxH="200px"
      ></Image>
    </Flex>
  );
};

export default ChooseGame;
