import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGame, getGames } from "@/services/adminService";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";
import {
  Flex,
  Button,
  FormControl,
  Input,
  Switch,
  FormLabel,
  FormErrorMessage,
  Box,
  Heading,
  Divider,
  Text,
} from "@chakra-ui/react";

const schema = yup
  .object({
    name: yup.string().required("name is required"),
    isActive: yup.boolean().required("isActive is required"),
  })
  .required();

const SuperAdminGames = () => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: games, refetch } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames(axiosPrivate);
      return response.data.data.games;
    },
    onError: () => toast("Failed to fetch games", "error"),
  });

  const onCreateGameSuccess = () => {
    refetch();
    reset();
    toast(SUCCESS_MESSAGES.GAME_CREATE_SUCCESS, "success");
  };

  const onCreateGameError = (error) => {
    console.log(error);
    const errorMessages = {
      409: ERROR_MESSAGES.GAME_ALREADY_EXISTS,
    };

    const message = !error?.response
      ? ERROR_MESSAGES.NO_SERVER_RESPONSE
      : errorMessages[error.response?.status] ||
        ERROR_MESSAGES.GAME_CREATE_FAILED;

    toast(message, "error");
  };

  const createGameMutation = useMutation({
    mutationFn: async (data) => await createGame(axiosPrivate, data),
    onSuccess: onCreateGameSuccess,
    onError: onCreateGameError,
  });

  const onSubmit = async (values) => {
    createGameMutation.mutate(values);
  };

  return (
    <Box>
      <Heading size="md">Games</Heading>
      <Flex
        mt={4}
        as="form"
        direction="column"
        maxW="250px"
        bg="white"
        px={4}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl pt={4} isInvalid={!!formState?.errors?.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register("name")}
            focusBorderColor="primary.500"
            placeholder="Enter game name"
          />
          <FormErrorMessage>
            {formState?.errors?.name?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl pt={4} isInvalid={!!formState?.errors?.isActive}>
          <FormLabel>Is Active</FormLabel>
          <Switch colorScheme="primary" {...register("isActive")} />
          <FormErrorMessage>
            {formState?.errors?.isActive?.message}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="primary" mt={4}>
          Create Game
        </Button>
      </Flex>

      <Divider my={4} bg="gray.900" />

      <Flex gap={4}>
        {games?.map((game) => (
          <Box key={game.id}>
            <Text>Game Name: {game.name}</Text>
            <Text>IsActive: {game.isActive ? "true" : "false"}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default SuperAdminGames;
