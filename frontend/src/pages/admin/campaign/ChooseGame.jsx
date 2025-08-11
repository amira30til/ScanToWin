import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useTranslation } from "react-i18next";

import {
  selectGame,
  getShopGameAssignement,
  getGames,
} from "@/services/gameService";

// COMPONENTS
import AdminSection from "@/components/common/AdminSection";

// STYLE
import { Flex, Text, Image, Button, Box, SimpleGrid } from "@chakra-ui/react";

const ChooseGame = ({ shop }) => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { control, watch, reset } = useForm();

  const { data: games = [] } = useQuery({
    queryKey: ["active-games"],
    queryFn: async () => {
      const response = await getGames();
      return response.data.data.games;
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
    toast(t("choose_game.success"), "success");
  };

  const onSelectGameError = (error) => {
    console.log(error);
    toast(t("choose_game.error"), "error");
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
      title={t("choose_game.title")}
      description={t("choose_game.description")}
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
          {t("choose_game.save_button")}
        </Button>
      </Flex>
    </AdminSection>
  );
};

const SelectableGameCard = ({ game, isSelected, onSelect }) => {
  const borderColor = isSelected ? "primary.500" : "gray.300";
  const border = isSelected ? "2px" : "1px";
  const { t } = useTranslation();

  const activeGame = game.status === "active";
  const archivedGame = game.status === "archived";

  return (
    <Flex
      position="relative"
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
      pointerEvents={archivedGame ? "none" : activeGame ? "auto" : ""}
      cursor={archivedGame ? "not-allowed" : activeGame ? "pointer" : ""}
    >
      <Flex direction="column" gap={1} justify="center" align="center">
        <Text fontWeight="bold">{game.name}</Text>
        <Text fontSize="sm" color="gray" maxW="300px" textAlign="center">
          {game.description || t("choose_game.no_description")}
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
      {archivedGame && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(2px)"
          borderRadius="inherit"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          fontSize="lg"
          pointerEvents="none"
        >
          {t("choose_game.coming_soon")}
        </Box>
      )}
    </Flex>
  );
};

export default ChooseGame;
