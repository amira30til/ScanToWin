import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { dataURLtoFile } from "@/utils/helpers";

import * as yup from "yup";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGame, getGames } from "@/services/adminService";
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
  Divider,
  Text,
  Image,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";

const schema = yup
  .object({
    name: yup.string().required("name is required"),
    description: yup.string().required("description is required"),
    isActive: yup.boolean().required("isActive is required"),
    pictureUrl: yup.string().required("picture is required"),
  })
  .required();

const SuperAdminGames = () => {
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
    onError: () => toast("Failed to fetch games", "error"),
  });

  const createGameMutationFn = async (values) => {
    const formData = new FormData();
    const onError = () => {
      toast("Invalid image format", "error");
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

  return (
    <Box w="25%">
      <Heading size="md">Games</Heading>
      <Flex
        mt={4}
        as="form"
        direction="column"
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
        <FormControl pt={4} isInvalid={!!formState?.errors?.name}>
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
        <FormControl pt={4} isInvalid={!!formState?.errors?.isActive}>
          <FormLabel>Is Active</FormLabel>
          <Switch colorScheme="primary" {...register("isActive")} />
          <FormErrorMessage>
            {formState?.errors?.isActive?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
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
        </FormControl>
        <Button
          type="submit"
          colorScheme="primary"
          mt={4}
          isLoading={createGameMutation.isPending}
        >
          Create Game
        </Button>
      </Flex>

      <Divider my={4} bg="gray.900" />

      <Flex gap={4}>
        {games?.map((game) => (
          <Box key={game.id}>
            <Text>Game Name: {game.name}</Text>
            <Text>Game Description: {game.description}</Text>
            <Text>IsActive: {game.isActive ? "true" : "false"}</Text>
            <Image
              src={game.pictureUrl}
              alt="Picture Preview"
              maxHeight="100px"
              borderRadius="md"
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default SuperAdminGames;
