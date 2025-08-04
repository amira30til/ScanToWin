import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";

import { dataURLtoFile } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { createGame, getGames, updateGame } from "@/services/gameService";
import { createGameSchema } from "@/schemas/createGame";

import IconButton from "@/components/common/IconButton";
import DeleteGameModal from "./DeleteGameModal";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";
import {
  useToken,
  Flex,
  Button,
  FormControl,
  Input,
  Select,
  FormLabel,
  FormErrorMessage,
  Box,
  SimpleGrid,
  Badge,
  Text,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";
import { Trash, ArchiveRestore, Archive } from "lucide-react";

const Games = () => {
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [primary500] = useToken("colors", ["primary.500"]);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [deleteGameId, setDeleteGameId] = useState("");

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(createGameSchema),
  });

  const { data: games, refetch } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames();
      return response.data.data.games;
    },
    onError: () => toast("Failed to fetch games", "error"),
  });

  const createGameMutationFn = async (values) => {
    const formData = new FormData();
    const onError = () => {
      toast("Invalid image format", "error");
    };

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append(
      "pictureUrl",
      dataURLtoFile(values.pictureUrl, "picture.png", onError),
    );

    const response = await createGame(axiosPrivate, formData);

    return response.data.game;
  };

  const onCreateGameSuccess = () => {
    refetch();
    reset();
    setPreviewImage(null);
    setValue("pictureUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast(SUCCESS_MESSAGES.GAME_CREATE_SUCCESS, "success");
  };

  const onCreateGameError = (error) => {
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
    mutationFn: createGameMutationFn,
    onSuccess: onCreateGameSuccess,
    onError: onCreateGameError,
  });

  const updateGameMutation = useMutation({
    mutationFn: async ({ gameId, values }) =>
      await updateGame(axiosPrivate, gameId, values),
    onSuccess: () => refetch(),
  });

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPreviewImage(result);
        setValue("pictureUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPicture = () => {
    setPreviewImage(null);
    setValue("pictureUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerPictureUpload = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values) => {
    createGameMutation.mutate(values);
  };

  const archiveGameHandler = (gameId) => {
    if (!!gameId) {
      updateGameMutation.mutate({ gameId, values: { status: "archived" } });
    }
  };

  const restoreGameHandler = (gameId) => {
    if (!!gameId) {
      updateGameMutation.mutate({
        gameId,
        values: { status: "active" },
      });
    }
  };

  return (
    <>
      <Flex direction="column" gap={4}>
        <Box as="form" bg="white" p={4} onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid columns={4} gap={6}>
            <FormControl isInvalid={!!formState?.errors?.pictureUrl}>
              <FormLabel>Game Picture</FormLabel>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {previewImage ? (
                <Box position="relative" width="fit-content">
                  <Image
                    src={previewImage}
                    alt="Picture Preview"
                    maxHeight="100px"
                    borderRadius="md"
                  />
                  <IconButton
                    aria-label="Remove pictureUrl"
                    icon={<LuX size={16} />}
                    size="sm"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    rounded="full"
                    onClick={clearPicture}
                  />
                </Box>
              ) : (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={5}
                  cursor="pointer"
                  onClick={triggerPictureUpload}
                  _hover={{ borderColor: "primary.500" }}
                  transition="all 0.2s"
                >
                  <LuUpload size={24} color={primary500} />
                  <Text mt={2} fontSize="sm">
                    Upload pictureUrl image
                  </Text>
                </Flex>
              )}
              <FormErrorMessage>
                {formState?.errors?.pictureUrl?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formState?.errors?.name}>
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
            <FormControl isInvalid={!!formState?.errors?.name}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description")}
                focusBorderColor="primary.500"
                placeholder="Enter game description"
              />
              <FormErrorMessage>
                {formState?.errors?.description?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formState?.errors?.status}>
              <FormLabel>Status</FormLabel>

              <Select
                maxW="300px"
                bg="white"
                borderRadius="md"
                fontWeight="bold"
                focusBorderColor="primary.500"
                cursor="pointer"
                {...register("status")}
                defaultValue="active"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>

              <FormErrorMessage>
                {formState?.errors?.status?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Flex justify="end">
            <Button
              type="submit"
              colorScheme="primary"
              mt={4}
              isLoading={createGameMutation.isPending}
            >
              Create Game
            </Button>
          </Flex>
        </Box>

        <SimpleGrid
          columns={{ sm: 1, md: 3 }}
          bg="surface.popover"
          direction={{ base: "column", lg: "row" }}
          gap={8}
          p={10}
        >
          {games?.map((game) => (
            <Flex direction="column" gap={4} key={game.id}>
              <Flex direction="column" gap={4}>
                <Flex align="center" justify="space-between">
                  <Text fontWeight="bold">{game.name}</Text>
                  <Flex justify="center" gap={2}>
                    {game.status === "active" && (
                      <IconButton
                        label="archive game"
                        icon={<Archive size={20} />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => archiveGameHandler(game?.id)}
                      />
                    )}

                    {game.status === "archived" && (
                      <IconButton
                        label="restore game"
                        icon={<ArchiveRestore size={20} />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => restoreGameHandler(game?.id)}
                      />
                    )}

                    <IconButton
                      label="delete game"
                      icon={<Trash size={20} />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteGameId(game.id);
                        onOpen();
                      }}
                    />
                  </Flex>
                </Flex>
                <Flex>
                  <Badge
                    colorScheme={
                      game.status === "active"
                        ? "green"
                        : game.status === "archived"
                          ? "yellow"
                          : ""
                    }
                  >
                    {game.status}
                  </Badge>
                </Flex>
                <Text>{game.description}</Text>
              </Flex>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={4}
              >
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
          ))}
        </SimpleGrid>
      </Flex>

      <DeleteGameModal
        isOpen={isOpen}
        onClose={onClose}
        gameId={deleteGameId}
        refetch={refetch}
      />
    </>
  );
};

export default Games;
