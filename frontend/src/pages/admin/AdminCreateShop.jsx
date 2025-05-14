import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LuHome } from "react-icons/lu";
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
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";

const shopFormSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .required("Shop name is required"),
});

const AdminCreateShop = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(shopFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
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
      reset();
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
