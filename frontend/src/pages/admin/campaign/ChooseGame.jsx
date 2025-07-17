// HOOKS
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useAxiosPrivate, useToast } from "@/hooks";

// FUNCTIONS
import {
  getActiveGames,
  selectGame,
  getShopGameAssignement,
} from "@/services/adminService";

// COMPONENTS
import AdminSection from "@/components/common/AdminSection";

// STYLE
import { Flex, Text, Image, Button, Box, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";

const ChooseGame = ({ shop }) => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { control, watch, reset } = useForm();

  const { data: games = [] } = useQuery({
    queryKey: ["active-games"],
    queryFn: async () => {
      const response = await getActiveGames();
      return response.data.data.data;
    },
  });

  const { data: activeGame } = useQuery({
    queryKey: ["shop-game-assignment", shop?.id],
    queryFn: async () => {
      const response = await getShopGameAssignement(shop.id);
      const result = response.data.data.data;
      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return response.data.data.data.gameId;
    },
    enabled: !!shop?.id,
  });

  const selectedGameId = watch("selectedGameId");

  const onSelectGameSuccess = async () => {
    await queryClient.refetchQueries(["adminGames"]);
    toast("Game selected successfully!", "success");
  };

  const onSelectGameError = (error) => {
    console.log(error);
    toast("There was an error selecting your game.", "error");
  };

  const selectGameMutation = useMutation({
    mutationFn: async (values) =>
      await selectGame(
        axiosPrivate,
        shop.id,
        selectedGameId,
        shop?.adminId,
        values,
      ),
    onSuccess: onSelectGameSuccess,
    onError: onSelectGameError,
  });

  const onSubmit = () => {
    if (!!shop?.id && !!shop?.adminId) {
      selectGameMutation.mutate({ isActive: true });
    }
  };

  useEffect(() => {
    if (activeGame !== undefined && activeGame !== "") {
      reset({ selectedGameId: activeGame });
    }
  }, [activeGame]);

  return (
    <AdminSection
      title="Game selection"
      description="Choose from 3 interactive games to engage your users and create a unique experience."
    >
      <SimpleGrid columns={{ md: 1, lg: 3 }} gap={6}>
        {games?.map((game) => (
          <Controller
            key={game.id}
            control={control}
            name="selectedGameId"
            render={({ field: { onChange, value } }) => (
              <SelectableGameCard
                game={game}
                isSelected={value === game.id}
                onSelect={() => onChange(game.id)}
              />
            )}
          />
        ))}
      </SimpleGrid>
      <Flex justify="flex-end">
        <Button
          colorScheme="primary"
          isLoading={selectGameMutation.isPending}
          onClick={onSubmit}
        >
          Save
        </Button>
      </Flex>
    </AdminSection>
  );
};

const SelectableGameCard = ({ game, isSelected, onSelect }) => {
  const borderColor = isSelected ? "primary.500" : "gray.300";
  const border = isSelected ? "2px" : "1px";

  return (
    <Flex
      direction="column"
      border={border}
      borderColor={borderColor}
      borderRadius="3xl"
      gap={6}
      m={1}
      p={8}
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
      onClick={onSelect}
      bg={isSelected ? "white" : "inherit"}
    >
      <Flex direction="column" gap={1} justify="center" align="center">
        <Text fontWeight="bold">{game.name}</Text>
        <Text fontSize="sm" color="gray" maxW="300px" textAlign="center">
          {game.description || "No description available."}
        </Text>
      </Flex>
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Image
          src={game.pictureUrl}
          alt={game.name}
          boxSize="280px"
          objectFit="cover"
          borderRadius="full"
          boxShadow="lg"
          border="2px solid"
          borderColor="gray.200"
        />
      </Box>
    </Flex>
  );
};

export default ChooseGame;
