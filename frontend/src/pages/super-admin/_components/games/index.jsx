import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  Select,
  FormLabel,
  FormErrorMessage,
  Box,
  SimpleGrid,
  Badge,
  Text,
  Image,
  Textarea,
  Card,
  CardBody,
  CardFooter,
  Heading,
  useColorModeValue,
  Stack,
  Icon,
  Avatar,
  Input,
  AspectRatio,
  Center,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";
import { Trash, ArchiveRestore, Archive, Edit } from "lucide-react";

const Games = () => {
  const { t } = useTranslation();

  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [primary500] = useToken("colors", ["primary.500"]);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [deleteGameId, setDeleteGameId] = useState("");

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("primary.300", "primary.500");
  const textColor = useColorModeValue("gray.700", "gray.200");

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
    <Box p={{ base: 4, md: 8 }}>
      {/* Create Game Form */}
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        mb={8}
      >
        <CardBody>
          <Heading size="lg" mb={6} color="text.primary">
            {t("games.form.createGame")}
          </Heading>

          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
              <FormControl isInvalid={!!formState?.errors?.pictureUrl}>
                <FormLabel>{t("games.form.picture")}</FormLabel>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                {previewImage ? (
                  <Box position="relative" width="fit-content">
                    <AspectRatio ratio={1} width="120px">
                      <Image
                        src={previewImage}
                        alt="Picture Preview"
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderColor}
                        objectFit="contain"
                        bg="gray.50"
                      />
                    </AspectRatio>
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
                    borderColor={borderColor}
                    borderRadius="md"
                    p={6}
                    cursor="pointer"
                    onClick={triggerPictureUpload}
                    _hover={{ borderColor: hoverBorderColor }}
                    transition="all 0.2s"
                    height="120px"
                    bg="gray.50"
                  >
                    <Icon as={LuUpload} boxSize={6} color={primary500} />
                    <Text mt={2} fontSize="sm" color="text.secondary">
                      {t("games.form.uploadPicture")}
                    </Text>
                  </Flex>
                )}
                <FormErrorMessage>
                  {formState?.errors?.pictureUrl?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formState?.errors?.name}>
                <FormLabel>{t("games.form.name")}</FormLabel>
                <Select
                  bg="white"
                  borderRadius="md"
                  focusBorderColor="primary.500"
                  cursor="pointer"
                  {...register("name")}
                >
                  <option value="Fortune Wheel">
                    {t("games.gameNames.fortuneWheel")}
                  </option>
                  <option value="Mysterious Box">
                    {t("games.gameNames.mysteriousBox")}
                  </option>
                  <option value="Slot Machine">
                    {t("games.gameNames.slotMachine")}
                  </option>
                </Select>
                <FormErrorMessage>
                  {formState?.errors?.name?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formState?.errors?.description}>
                <FormLabel>{t("games.form.description")}</FormLabel>
                <Textarea
                  {...register("description")}
                  focusBorderColor="primary.500"
                  placeholder={t("games.form.descriptionPlaceholder")}
                  rows={3}
                />
                <FormErrorMessage>
                  {formState?.errors?.description?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formState?.errors?.status}>
                <FormLabel>{t("games.form.status")}</FormLabel>
                <Select
                  bg="white"
                  borderRadius="md"
                  fontWeight="medium"
                  focusBorderColor="primary.500"
                  cursor="pointer"
                  {...register("status")}
                  defaultValue="active"
                >
                  <option value="active">{t("games.status.active")}</option>
                  <option value="archived">{t("games.status.archived")}</option>
                </Select>
                <FormErrorMessage>
                  {formState?.errors?.status?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <Flex justify="flex-end" mt={6}>
              <Button
                type="submit"
                colorScheme="primary"
                size="md"
                isLoading={createGameMutation.isPending}
              >
                {t("games.form.createGame")}
              </Button>
            </Flex>
          </Box>
        </CardBody>
      </Card>

      {/* Games List */}
      <Heading size="lg" mb={6} color="text.primary">
        {t("games.list.title")}
      </Heading>

      {games?.length === 0 ? (
        <Card textAlign="center" py={10} bg={cardBg}>
          <Text fontSize="lg" color="text.secondary">
            {t("games.list.empty")}
          </Text>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {games?.map((game) => (
            <Card
              key={game.id}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <AspectRatio ratio={4 / 3}>
                <Center bg="gray.50" position="relative">
                  <Image
                    src={game.pictureUrl}
                    alt={game.name}
                    objectFit="contain"
                    width="100%"
                    height="100%"
                    p={4}
                  />
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    colorScheme={game.status === "active" ? "green" : "yellow"}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {t(`games.status.${game.status}`)}
                  </Badge>
                </Center>
              </AspectRatio>

              <CardBody>
                <Flex justify="space-between" align="center" mb={3}>
                  <Heading size="md" color={textColor}>
                    {game.name}
                  </Heading>
                  <Flex gap={2}>
                    {game.status === "active" ? (
                      <IconButton
                        aria-label={t("games.ariaLabels.archiveGame")}
                        icon={<Archive size={18} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="orange"
                        onClick={() => archiveGameHandler(game?.id)}
                      />
                    ) : (
                      <IconButton
                        aria-label={t("games.ariaLabels.restoreGame")}
                        icon={<ArchiveRestore size={18} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => restoreGameHandler(game?.id)}
                      />
                    )}
                    <IconButton
                      aria-label={t("games.ariaLabels.deleteGame")}
                      icon={<Trash size={18} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteGameId(game.id);
                        onOpen();
                      }}
                    />
                  </Flex>
                </Flex>
                <Text color="text.secondary" noOfLines={3}>
                  {game.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <DeleteGameModal
        isOpen={isOpen}
        onClose={onClose}
        gameId={deleteGameId}
        refetch={refetch}
      />
    </Box>
  );
};

export default Games;
