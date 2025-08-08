import { useForm } from "react-hook-form";
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
import Logo from "@/components/Logo";
import { createShopSchema } from "@/schemas/shop/createShop";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store";
import { createShop } from "@/services/shopService";
import { decodeToken } from "@/utils/auth";
import { queryClient } from "@/index";
import { useTranslation } from "react-i18next";

const CreateShop = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const axiosPrivate = useAxiosPrivate();

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
    toast(t("create_shop_success"), "success");
    reset();
  };

  const onCreateShopError = (error) => {
    console.log(error);
    toast(t("create_shop_error"), "error");
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
        <Flex align="center">
          <Logo w="150px" />
        </Flex>
      </Flex>
      <Container maxW="container.lg">
        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="xl" mb={4}>
            {t("create_shop")}
          </Heading>
          <Text color="gray.600">{t("create_shop_description")} </Text>
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
              <FormLabel htmlFor="name">{t("shop_name")}</FormLabel>
              <Input
                id="name"
                placeholder={t("enter_shop_name")}
                {...register("name")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.tel}>
              <FormLabel htmlFor="tel">{t("phone_number")}</FormLabel>
              <Input
                id="tel"
                placeholder={t("enter_phone_number")}
                {...register("tel")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.tel && errors.tel.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.address}>
              <FormLabel htmlFor="address">{t("address")}</FormLabel>
              <Input
                id="address"
                placeholder={t("enter_address")}
                {...register("address")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.city}>
              <FormLabel htmlFor="city">{t("city")}</FormLabel>
              <Input
                id="city"
                placeholder={t("enter_city")}
                {...register("city")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.country}>
              <FormLabel htmlFor="country">{t("country")}</FormLabel>
              <Input
                id="country"
                placeholder={t("enter_country")}
                {...register("country")}
                focusBorderColor="primary.500"
              />
              <FormErrorMessage>
                {errors.country && errors.country.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.zipCode}>
              <FormLabel htmlFor="zipCode">{t("zip_code")}</FormLabel>
              <Input
                id="zipCode"
                placeholder={t("enter_zip_code")}
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
              {t("create_shop_button")}{" "}
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateShop;
