import { useForm } from "react-hook-form";
import { useToast, useAxiosPrivate, useLogout } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store";

import { createShopSchema } from "@/schemas/shop/createShop";
import { yupResolver } from "@hookform/resolvers/yup";
import { createShop } from "@/services/shopService";
import { decodeToken } from "@/utils/auth";
import { queryClient } from "@/index";

import Logo from "@/components/Logo";

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
  Flex,
} from "@chakra-ui/react";

const CreateShop = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  let adminId = decodeToken(auth?.accessToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createShopSchema),
  });

  const onCreateShopSuccess = async () => {
    await queryClient.refetchQueries(["adminShops"]);
    navigate("/admin");
    toast("Shop created!", "success");
    reset();
  };

  const onCreateShopError = (error) => {
    console.log(error);
    if (error?.status === 409) {
      toast("You already have a shop with this name.", "error");
    } else {
      toast("There was an error creating your shop.", "error");
    }
  };

  const createShopMutation = useMutation({
    mutationFn: async (values) =>
      await createShop(axiosPrivate, adminId, values),
    onSuccess: onCreateShopSuccess,
    onError: onCreateShopError,
  });

  const onSubmit = async (values) => {
    if (!!adminId) {
      createShopMutation.mutate(values);
    }
  };

  return (
    <Box minH="100vh" py={10} px={4} bg="gray.50">
      <Flex
        as="header"
        maxW="7xl"
        mx="auto"
        align="center"
        justify="space-between"
      >
        <Flex align="center" justify="space-between">
          <Logo w="150px" />
        </Flex>
        <Button colorScheme="primary" type="button" size="sm" onClick={signOut}>
          Sign Out
        </Button>
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
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel htmlFor="name">Shop Name</FormLabel>
              <Input
                id="name"
                placeholder="Enter shop name"
                {...register("name")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.tel}>
              <FormLabel htmlFor="tel">Phone Number</FormLabel>
              <Input
                id="tel"
                placeholder="Enter phone number"
                {...register("tel")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.tel && errors.tel.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.address}>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input
                id="address"
                placeholder="Enter street address"
                {...register("address")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.city}>
              <FormLabel htmlFor="city">City</FormLabel>
              <Input
                id="city"
                placeholder="Enter city"
                {...register("city")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.country}>
              <FormLabel htmlFor="country">Country</FormLabel>
              <Input
                id="country"
                placeholder="Enter country"
                {...register("country")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.country && errors.country.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.zipCode}>
              <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
              <Input
                id="zipCode"
                placeholder="Enter zip code"
                {...register("zipCode")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.zipCode && errors.zipCode.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="primary"
              isLoading={createShopMutation.isPending}
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

export default CreateShop;
