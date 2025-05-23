// HOOKS
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useAxiosPrivate, useToast } from "@/hooks";

// FUNCTIONS
import { getGames, selectGame } from "@/services/adminService";

// COMPONENTS
import AdminSection from "@/components/common/AdminSection";

// STYLE
import { Flex, Text, Image, Button } from "@chakra-ui/react";

// ASSETS
import gameImg from "@/assets/game.jpeg";
import { useEffect } from "react";

const ChooseGame = ({ shop }) => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames(axiosPrivate);
      return response.data.data.games;
    },
    onError: (error) => {
      console.log(error);
      toast("Failed to fetch games", "error");
    },
  });

  const { control, watch } = useForm({
    defaultValues: {
      selectedGameId: null,
    },
  });

  const selectedGameId = watch("selectedGameId");

  const onSelectGameSuccess = async () => {
    await queryClient.refetchQueries(["adminGames"]);
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
    enabled: !!shop?.id && !!shop?.adminId,
    onSuccess: onSelectGameSuccess,
    onError: onSelectGameError,
  });

  const onSubmit = () => {
    selectGameMutation.mutate({ isActive: true });
  };

  useEffect(() => {
    console.log(selectedGameId);
  }, [selectedGameId]);

  return (
    <AdminSection
      title="Game selection"
      description="Choose from 3 interactive games to engage your users and create a unique experience."
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={8}
      >
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
      </Flex>
      <Flex justify="flex-end">
        <Button colorScheme="primary" onClick={onSubmit}>
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
        <Text fontSize="sm" color="gray">
          hard coded description hard coded description hard
        </Text>
      </Flex>
      <Image borderRadius="full" src={gameImg} />
    </Flex>
  );
};

export default ChooseGame;
