import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { dataURLtoFile } from "@/utils/helpers";

import * as yup from "yup";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGame, getGames } from "@/services/gameService";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";
import {
  useToken,
  Flex,
  Button,
  FormControl,
  Input,
  Switch,
  FormLabel,
  FormErrorMessage,
  Box,
  Heading,
  Badge,
  Text,
  Image,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";

import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();

  const schema = yup
    .object({
      name: yup.string().required(t("games.form.nameRequired")),
      description: yup.string().required(t("games.form.descriptionRequired")),
      isActive: yup.boolean().required(),
      pictureUrl: yup.string().required(t("games.form.picture")),
    })
    .required();

  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [primary500] = useToken("colors", ["primary.500"]);

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: games, refetch } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getGames(axiosPrivate);
      return response.data.data.games;
    },
    onError: () => toast(t("games.messages.fetchFailed"), "error"),
  });

  const createGameMutationFn = async (values) => {
    const formData = new FormData();
    const onError = () => {
      toast(t("games.messages.invalidImage"), "error");
    };

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("status", values.isActive);
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
    toast(t(SUCCESS_MESSAGES.GAME_CREATE_SUCCESS), "success");
  };

  const onCreateGameError = (error) => {
    const errorMessages = {
      409: t(ERROR_MESSAGES.GAME_ALREADY_EXISTS),
    };

    const message = !error?.response
      ? t(ERROR_MESSAGES.NO_SERVER_RESPONSE)
      : errorMessages[error.response?.status] ||
        t(ERROR_MESSAGES.GAME_CREATE_FAILED);

    toast(message, "error");
  };

  const createGameMutation = useMutation({
    mutationFn: createGameMutationFn,
    onSuccess: onCreateGameSuccess,
    onError: onCreateGameError,
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

  const deleteGameHandler = (gameId) => {
    // TODO: delete game endpoint
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={10}>
      <Box minW="400px">
        <Heading size="md">{t("games.form.createGame")}</Heading>
        <Flex
          mt={4}
          as="form"
          direction="column"
          bg="white"
          px={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl pt={4} isInvalid={!!formState?.errors?.name}>
            <FormLabel>{t("games.form.name")}</FormLabel>
            <Input
              {...register("name")}
              focusBorderColor="primary.500"
              placeholder={t("games.form.name")}
            />
            <FormErrorMessage>
              {formState?.errors?.name?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl pt={4} isInvalid={!!formState?.errors?.description}>
            <FormLabel>{t("games.form.description")}</FormLabel>
            <Textarea
              {...register("description")}
              focusBorderColor="primary.500"
              placeholder={t("games.form.description")}
            />
            <FormErrorMessage>
              {formState?.errors?.description?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl pt={4} isInvalid={!!formState?.errors?.isActive}>
            <FormLabel>{t("games.form.isActive")}</FormLabel>
            <Switch colorScheme="primary" {...register("isActive")} />
            <FormErrorMessage>
              {formState?.errors?.isActive?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
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
                <Image
                  src={previewImage}
                  alt={t("games.form.picture")}
                  maxHeight="100px"
                  borderRadius="md"
                />
                <IconButton
                  aria-label={t("games.form.picture")}
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
                  {t("games.form.uploadPicture")}
                </Text>
              </Flex>
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme="primary"
            mt={4}
            isLoading={createGameMutation.isPending}
          >
            {t("games.form.createGame")}
          </Button>
        </Flex>
      </Box>
      <Flex
        bg="surface.popover"
        direction={{ base: "column", lg: "row" }}
        gap={8}
        p={10}
      >
        {games?.map((game) => (
          <Flex direction="column" gap={4} key={game.id}>
            <Flex justify="end">
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => deleteGameHandler(game.id)}
              >
                {t("games.buttons.delete")}
              </Button>
            </Flex>
            <Flex direction="column" gap={4}>
              <Text fontWeight="bold">{game.name}</Text>
              <Flex>
                <Badge colorScheme={game.status === "active" ? "green" : "red"}>
                  {game.status === "active"
                    ? t("games.status.active")
                    : t("games.status.disabled")}
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
      </Flex>
    </Flex>
  );
};

export default Games;
