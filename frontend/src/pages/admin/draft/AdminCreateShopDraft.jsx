import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { LuUpload, LuX, LuHome } from "react-icons/lu";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Switch,
  VStack,
  useToast,
  Flex,
  Image,
  IconButton,
  useToken,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import LocationInput from "@/components/LocationInput";

const shopFormSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .required("Shop name is required"),
  logo: yup.string().optional(),
  sbSiret: yup
    .string()
    .matches(/^\d+$/, "SIRET must contain only numbers")
    .optional(),
  gameCodePin: yup
    .string()
    .matches(/^\d+$/, "Game code pin must contain only numbers")
    .optional(),
  isGuaranteedWin: yup.boolean().default(false),
  QrCodeLink: yup
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

const AdminCreateShop = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const [primary500] = useToken("colors", ["primary.500"]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(shopFormSchema),
    defaultValues: {
      name: "",
      logo: "",
      sbSiret: "",
      gameCodePin: "",
      isGuaranteedWin: false,
      QrCodeLink: "",
    },
  });

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPreviewImage(result);
        setValue("logo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const clearLogo = () => {
    setPreviewImage(null);
    setValue("logo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted successfully:", data);

      toast({
        title: "Shop created!",
        description: `${data.name} has been successfully created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Reset form
      reset();
      setPreviewImage(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error creating your shop. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={10} px={4} bg="gray.50">
      <Flex
        as="header"
        maxW="7xl"
        mx="auto"
        mb={6}
        align="center"
        justify="space-between"
      >
        <Flex as={Link} to="/" align="center" gap={2}>
          <LuHome size={24} color="#9333ea" />{" "}
          <Text fontSize="xl" fontWeight="semibold" color="slate.800">
            Scan2Win
          </Text>
        </Flex>
      </Flex>
      <Container maxW="container.lg">
        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="xl" mb={4}>
            Create New Shop
          </Heading>
          <Text color="gray.600">
            Fill in the details below to create your shop profile
          </Text>
        </Box>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          p={8}
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          border="1px"
          borderColor="gray.200"
          maxWidth="700px"
          mx="auto"
        >
          <VStack spacing={6} align="stretch">
            <LocationInput />

            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Shop Name</FormLabel>
              <Input
                id="name"
                placeholder="Enter shop name"
                {...register("name")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Shop Logo</FormLabel>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {previewImage ? (
                <Box position="relative" width="fit-content">
                  <Image
                    src={previewImage}
                    alt="Logo Preview"
                    maxHeight="100px"
                    borderRadius="md"
                  />
                  <IconButton
                    aria-label="Remove logo"
                    icon={<LuX size={16} />}
                    size="sm"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    rounded="full"
                    onClick={clearLogo}
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
                  onClick={triggerLogoUpload}
                  _hover={{ borderColor: "primary.500" }}
                  transition="all 0.2s"
                >
                  <LuUpload size={24} color={primary500} />
                  <Text mt={2} fontSize="sm">
                    Upload logo image
                  </Text>
                </Flex>
              )}

              <Text mt={2} fontSize="sm" color="gray.500">
                Or enter logo URL directly:
              </Text>
              <Input
                mt={1}
                placeholder="https://example.com/logo.png"
                {...register("logo")}
                onChange={(e) => {
                  if (e.target.value) {
                    setPreviewImage(e.target.value);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                focusBorderColor="primary.500"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.sbSiret}>
              <FormLabel htmlFor="sbSiret">SIRET Number</FormLabel>
              <Input
                id="sbSiret"
                placeholder="Enter SIRET number"
                {...register("sbSiret")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.sbSiret?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.gameCodePin}>
              <FormLabel htmlFor="gameCodePin">Game Code PIN</FormLabel>
              <Input
                id="gameCodePin"
                placeholder="Enter game code PIN"
                {...register("gameCodePin")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.gameCodePin?.message}</FormErrorMessage>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="isGuaranteedWin" mb="0">
                Guaranteed Win
              </FormLabel>
              <Switch
                id="isGuaranteedWin"
                colorScheme="primary"
                {...register("isGuaranteedWin")}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.QrCodeLink}>
              <FormLabel htmlFor="QrCodeLink">QR Code Link</FormLabel>
              <Input
                id="QrCodeLink"
                placeholder="https://example.com/qrcode"
                {...register("QrCodeLink")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.QrCodeLink?.message}</FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="primary"
              isLoading={isLoading}
              type="submit"
              size="lg"
              width="full"
            >
              Create Shop
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminCreateShop;
