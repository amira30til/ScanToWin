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
  Heading,
  useColorModeValue,
  Icon,
  Input,
  AspectRatio,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Divider,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LuUpload, LuX, LuPlus, LuGamepad2, LuImage } from "react-icons/lu";
import { Edit3 } from "lucide-react";
import { Trash, ArchiveRestore, Archive, Edit, Sparkles } from "lucide-react";

// Edit Game Modal Component
const EditGameModal = ({ isOpen, onClose, game, refetch }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(game?.pictureUrl || null);

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(createGameSchema),
    defaultValues: {
      name: game?.name || "",
      description: game?.description || "",
      status: game?.status || "active",
      pictureUrl: game?.pictureUrl || "",
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("status", values.status);

      if (values.pictureUrl && values.pictureUrl !== game?.pictureUrl) {
        const onError = () => toast("Invalid image format", "error");
        formData.append(
          "pictureUrl",
          dataURLtoFile(values.pictureUrl, "picture.png", onError),
        );
      }

      return await updateGame(axiosPrivate, game.id, formData);
    },
    onSuccess: () => {
      refetch();
      onClose();
      reset();
      toast("Game updated successfully", "success");
    },
    onError: (error) => {
      toast("Failed to update game", "error");
    },
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

  const onSubmit = (values) => {
    updateGameMutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        mx={4}
        bg="white"
        borderRadius="24px"
        overflow="hidden"
        boxShadow="0 25px 50px -12px rgba(217, 0, 100, 0.25)"
        border="1px solid"
        borderColor="rgba(217, 0, 100, 0.1)"
      >
        <ModalHeader
          bg="linear-gradient(135deg, #E6177A 0%, #FF5AA8 100%)"
          color="white"
          py={6}
          px={8}
        >
          <HStack spacing={3}>
            <Icon as={Edit3} boxSize={6} />
            <Text fontSize="xl" fontWeight="bold">
              {t("games.form.editGame")}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" size="lg" top={4} right={4} />

        <ModalBody p={8}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Picture Upload */}
              <FormControl isInvalid={!!formState?.errors?.pictureUrl}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.primary"
                  mb={3}
                >
                  <HStack spacing={2}>
                    <Icon as={LuImage} boxSize={4} />
                    <Text>{t("games.form.picture")}</Text>
                  </HStack>
                </FormLabel>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <Center>
                  {previewImage ? (
                    <Box position="relative">
                      <AspectRatio ratio={1} width="160px">
                        <Image
                          src={previewImage}
                          alt="Picture Preview"
                          borderRadius="16px"
                          border="2px solid"
                          borderColor="primary.100"
                          objectFit="contain"
                          bg="gray.50"
                          boxShadow="card"
                        />
                      </AspectRatio>
                      <IconButton
                        aria-label="Remove picture"
                        icon={<LuX size={16} />}
                        size="sm"
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme="red"
                        rounded="full"
                        onClick={clearPicture}
                        boxShadow="0 4px 12px rgba(229, 62, 62, 0.3)"
                      />
                    </Box>
                  ) : (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      border="2px dashed"
                      borderColor="primary.200"
                      borderRadius="16px"
                      p={8}
                      cursor="pointer"
                      onClick={() => fileInputRef.current?.click()}
                      _hover={{
                        borderColor: "primary.400",
                        bg: "primary.50",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      width="160px"
                      height="160px"
                      bg="gray.50"
                    >
                      <Icon
                        as={LuUpload}
                        boxSize={8}
                        color="primary.500"
                        mb={3}
                      />
                      <Text
                        fontSize="sm"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {t("games.form.uploadPicture")}
                      </Text>
                    </Flex>
                  )}
                </Center>

                <FormErrorMessage justifyContent="center">
                  {formState?.errors?.pictureUrl?.message}
                </FormErrorMessage>
              </FormControl>

              <Divider borderColor="gray.100" />

              {/* Form Fields */}
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <FormControl isInvalid={!!formState?.errors?.name}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                  >
                    {t("games.form.name")}
                  </FormLabel>
                  <Select
                    bg="white"
                    borderRadius="12px"
                    border="2px solid"
                    borderColor="gray.100"
                    focusBorderColor="primary.500"
                    _hover={{ borderColor: "primary.200" }}
                    _focus={{
                      borderColor: "primary.500",
                      boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                    }}
                    size="lg"
                    fontWeight="medium"
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

                <FormControl isInvalid={!!formState?.errors?.status}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                  >
                    {t("games.form.status")}
                  </FormLabel>
                  <Select
                    bg="white"
                    borderRadius="12px"
                    border="2px solid"
                    borderColor="gray.100"
                    focusBorderColor="primary.500"
                    _hover={{ borderColor: "primary.200" }}
                    _focus={{
                      borderColor: "primary.500",
                      boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                    }}
                    size="lg"
                    fontWeight="medium"
                    {...register("status")}
                  >
                    <option value="active">{t("games.status.active")}</option>
                    <option value="archived">
                      {t("games.status.archived")}
                    </option>
                  </Select>
                  <FormErrorMessage>
                    {formState?.errors?.status?.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl isInvalid={!!formState?.errors?.description}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.primary"
                >
                  {t("games.form.description")}
                </FormLabel>
                <Textarea
                  {...register("description")}
                  borderRadius="12px"
                  border="2px solid"
                  borderColor="gray.100"
                  focusBorderColor="primary.500"
                  _hover={{ borderColor: "primary.200" }}
                  _focus={{
                    borderColor: "primary.500",
                    boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                  }}
                  placeholder={t("games.form.descriptionPlaceholder")}
                  rows={4}
                  resize="vertical"
                  size="lg"
                />
                <FormErrorMessage>
                  {formState?.errors?.description?.message}
                </FormErrorMessage>
              </FormControl>

              <HStack spacing={4} pt={4}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onClose}
                  borderRadius="12px"
                  color="text.secondary"
                  _hover={{ bg: "gray.100" }}
                  flex={1}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  borderRadius="12px"
                  bg="linear-gradient(135deg, #E6177A 0%, #FF5AA8 100%)"
                  color="white"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(217, 0, 100, 0.3)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  isLoading={updateGameMutation.isPending}
                  loadingText="Updating..."
                  flex={2}
                  fontWeight="semibold"
                >
                  <HStack spacing={2}>
                    <Icon as={Sparkles} boxSize={4} />
                    <Text>{t("games.form.updateGame")}</Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Games = () => {
  const { t } = useTranslation();

  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [deleteGameId, setDeleteGameId] = useState("");

  // Edit modal state
  const {
    onOpen: onEditOpen,
    isOpen: isEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [editingGame, setEditingGame] = useState(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(createGameSchema),
    defaultValues: {
      status: "active",
    },
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

  const handleEditGame = (game) => {
    setEditingGame(game);
    onEditOpen();
  };

  const handleDeleteGame = (gameId) => {
    setDeleteGameId(gameId);
    onOpen();
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="background" minH="100vh">
      {/* Header */}
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <HStack justify="center" spacing={3} mb={4}>
            <Icon as={LuGamepad2} boxSize={8} color="primary.500" />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, primary.600, primary.400)"
              bgClip="text"
              fontWeight="bold"
            >
              {t("games.management.title")}
            </Heading>
          </HStack>
          <Text color="text.secondary" fontSize="lg">
            {t("games.management.subtitle")}
          </Text>
        </Box>

        {/* Create Game Form */}
        <Card
          bg="surface.card"
          borderRadius="24px"
          border="1px solid"
          borderColor="rgba(217, 0, 100, 0.1)"
          overflow="hidden"
          boxShadow="0 10px 25px rgba(217, 0, 100, 0.08)"
          _hover={{
            boxShadow: "0 20px 40px rgba(217, 0, 100, 0.12)",
            transform: "translateY(-4px)",
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <Box bg="linear-gradient(135deg, #E6177A 0%, #FF5AA8 100%)" p={6}>
            <HStack spacing={3}>
              <Icon as={LuPlus} boxSize={6} color="white" />
              <Heading size="lg" color="white" fontWeight="bold">
                {t("games.form.createGame")}
              </Heading>
            </HStack>
          </Box>

          <CardBody p={8}>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={8} align="stretch">
                {/* Picture Upload Section */}
                <FormControl isInvalid={!!formState?.errors?.pictureUrl}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                    mb={4}
                  >
                    <HStack spacing={2}>
                      <Icon as={LuImage} boxSize={4} />
                      <Text>{t("games.form.picture")}</Text>
                    </HStack>
                  </FormLabel>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  <Center>
                    {previewImage ? (
                      <Box position="relative">
                        <AspectRatio ratio={1} width="200px">
                          <Image
                            src={previewImage}
                            alt="Picture Preview"
                            borderRadius="20px"
                            border="3px solid"
                            borderColor="primary.100"
                            objectFit="contain"
                            bg="gray.50"
                            boxShadow="0 8px 32px rgba(217, 0, 100, 0.15)"
                          />
                        </AspectRatio>
                        <IconButton
                          aria-label="Remove picture"
                          icon={<LuX size={18} />}
                          size="md"
                          position="absolute"
                          top="-12px"
                          right="-12px"
                          colorScheme="red"
                          rounded="full"
                          onClick={clearPicture}
                          boxShadow="0 4px 12px rgba(229, 62, 62, 0.4)"
                          _hover={{ transform: "scale(1.1)" }}
                          transition="all 0.2s"
                        />
                      </Box>
                    ) : (
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        border="3px dashed"
                        borderColor="primary.200"
                        borderRadius="20px"
                        p={12}
                        cursor="pointer"
                        onClick={triggerPictureUpload}
                        _hover={{
                          borderColor: "primary.400",
                          bg: "primary.50",
                          transform: "translateY(-4px)",
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        width="200px"
                        height="200px"
                        bg="gray.50"
                      >
                        <Icon
                          as={LuUpload}
                          boxSize={12}
                          color="primary.500"
                          mb={4}
                        />
                        <Text
                          fontSize="md"
                          color="text.secondary"
                          textAlign="center"
                          fontWeight="medium"
                        >
                          {t("games.form.uploadPicture")}
                        </Text>
                        <Text fontSize="sm" color="text.disabled" mt={2}>
                          PNG, JPG up to 10MB
                        </Text>
                      </Flex>
                    )}
                  </Center>

                  <FormErrorMessage justifyContent="center" fontSize="sm">
                    {formState?.errors?.pictureUrl?.message}
                  </FormErrorMessage>
                </FormControl>

                <Divider borderColor="gray.100" />

                {/* Form Fields */}
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                  <FormControl isInvalid={!!formState?.errors?.name}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="semibold"
                      color="text.primary"
                    >
                      {t("games.form.name")}
                    </FormLabel>
                    <Select
                      bg="white"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor="gray.100"
                      focusBorderColor="primary.500"
                      _hover={{ borderColor: "primary.200" }}
                      _focus={{
                        borderColor: "primary.500",
                        boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                      }}
                      size="lg"
                      fontWeight="medium"
                      {...register("name")}
                    >
                      <option value="">Select a game...</option>
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

                  <FormControl isInvalid={!!formState?.errors?.status}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="semibold"
                      color="text.primary"
                    >
                      {t("games.form.status")}
                    </FormLabel>
                    <Select
                      bg="white"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor="gray.100"
                      focusBorderColor="primary.500"
                      _hover={{ borderColor: "primary.200" }}
                      _focus={{
                        borderColor: "primary.500",
                        boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                      }}
                      size="lg"
                      fontWeight="medium"
                      {...register("status")}
                      defaultValue="active"
                    >
                      <option value="active">{t("games.status.active")}</option>
                      <option value="archived">
                        {t("games.status.archived")}
                      </option>
                    </Select>
                    <FormErrorMessage>
                      {formState?.errors?.status?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Box />
                </SimpleGrid>

                <FormControl isInvalid={!!formState?.errors?.description}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                  >
                    {t("games.form.description")}
                  </FormLabel>
                  <Textarea
                    {...register("description")}
                    borderRadius="12px"
                    border="2px solid"
                    borderColor="gray.100"
                    focusBorderColor="primary.500"
                    _hover={{ borderColor: "primary.200" }}
                    _focus={{
                      borderColor: "primary.500",
                      boxShadow: "0 0 0 3px rgba(217, 0, 100, 0.1)",
                    }}
                    placeholder={t("games.form.descriptionPlaceholder")}
                    rows={4}
                    resize="vertical"
                    size="lg"
                  />
                  <FormErrorMessage>
                    {formState?.errors?.description?.message}
                  </FormErrorMessage>
                </FormControl>

                <Flex justify="flex-end" pt={4}>
                  <Button
                    type="submit"
                    size="lg"
                    borderRadius="12px"
                    bg="linear-gradient(135deg, #E6177A 0%, #FF5AA8 100%)"
                    color="white"
                    px={8}
                    py={6}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(217, 0, 100, 0.3)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                    isLoading={createGameMutation.isPending}
                    loadingText="Creating Game..."
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    <HStack spacing={3}>
                      <Icon as={Sparkles} boxSize={5} />
                      <Text>{t("games.form.createGame")}</Text>
                    </HStack>
                  </Button>
                </Flex>
              </VStack>
            </Box>
          </CardBody>
        </Card>

        {/* Games List */}
        <Box>
          <HStack justify="space-between" align="center" mb={8}>
            <VStack align="start" spacing={2}>
              <Heading size="xl" color="text.primary" fontWeight="bold">
                {t("games.list.title")}
              </Heading>
              <Text color="text.secondary" fontSize="md">
                {games?.length || 0} games total
              </Text>
            </VStack>
          </HStack>

          {games?.length === 0 ? (
            <Card
              bg="white"
              borderRadius="24px"
              border="2px dashed"
              borderColor="gray.200"
              p={16}
              textAlign="center"
            >
              <VStack spacing={4}>
                <Icon as={LuGamepad2} boxSize={16} color="gray.300" />
                <Heading size="md" color="text.secondary">
                  {t("games.list.empty")}
                </Heading>
                <Text color="text.disabled">
                  Create your first game to get started
                </Text>
              </VStack>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {games?.map((game) => (
                <Card
                  key={game.id}
                  bg="surface.card"
                  borderRadius="20px"
                  border="1px solid"
                  borderColor="rgba(217, 0, 100, 0.08)"
                  overflow="hidden"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
                  _hover={{
                    boxShadow: "0 20px 40px rgba(217, 0, 100, 0.15)",
                    transform: "translateY(-8px)",
                    borderColor: "primary.200",
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  position="relative"
                >
                  <AspectRatio ratio={4 / 3}>
                    <Center bg="gray.50" position="relative" p={4}>
                      <Image
                        src={game.pictureUrl}
                        alt={game.name}
                        objectFit="contain"
                        width="100%"
                        height="100%"
                        borderRadius="12px"
                      />
                    </Center>
                  </AspectRatio>

                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between" align="center">
                        <Heading
                          size="md"
                          color="text.primary"
                          fontWeight="bold"
                        >
                          {game.name}
                        </Heading>
                        <Badge
                          colorScheme={
                            game.status === "active" ? "green" : "gray"
                          }
                          px={3}
                          py={1}
                          borderRadius="full"
                          textTransform="capitalize"
                          fontSize="sm"
                        >
                          {game.status}
                        </Badge>
                      </HStack>

                      <Text
                        color="text.secondary"
                        fontSize="sm"
                        noOfLines={3}
                        minH="60px"
                      >
                        {game.description}
                      </Text>

                      <HStack spacing={2} mt={4}>
                        <IconButton
                          aria-label="Edit game"
                          icon={<Edit size={16} />}
                          size="sm"
                          colorScheme="primary"
                          onClick={() => handleEditGame(game)}
                        />
                        {game.status === "active" ? (
                          <IconButton
                            aria-label="Archive game"
                            icon={<Archive size={16} />}
                            size="sm"
                            colorScheme="orange"
                            onClick={() => archiveGameHandler(game.id)}
                          />
                        ) : (
                          <IconButton
                            aria-label="Restore game"
                            icon={<ArchiveRestore size={16} />}
                            size="sm"
                            colorScheme="green"
                            onClick={() => restoreGameHandler(game.id)}
                          />
                        )}
                        <IconButton
                          aria-label="Delete game"
                          icon={<Trash size={16} />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteGame(game.id)}
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>

      {/* Edit Game Modal */}
      <EditGameModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        game={editingGame}
        refetch={refetch}
      />

      {/* Delete Game Modal */}
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
