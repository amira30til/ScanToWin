// HOOKS
import { useEffect } from "react";
import { useAxiosPrivate, useToast } from "@/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { decodeToken } from "@/utils/auth";
import useAuthStore from "@/store";

// FUNCTIONS
import { updateShopColorValidator } from "@/validators/updateShopColorValidator";
import { updateShop } from "@/services/shopService";

// COMPONENTS
import TwoColorPicker from "@/components/TwoColorPicker";
import AdminSection from "@/components/common/AdminSection";

// STYLE
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Image,
  // useToken,
} from "@chakra-ui/react";

// ASSETS
import gameImg from "@/assets/game.jpeg";
import { yupResolver } from "@hookform/resolvers/yup";
const HAS_LOGO = true;

const CustomizeGame = ({ shop }) => {
  const axiosPrivate = useAxiosPrivate();
  const { shopId } = useParams();
  const auth = useAuthStore((state) => state.auth);
  const toast = useToast();
  const queryClient = useQueryClient();

  const defaultValues = {
    gameColor1: "#0000ff",
    gameColor2: "#ff0000",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(updateShopColorValidator),
  });
  const { handleSubmit, watch } = methods;
  const gameColor1 = watch("gameColor1");
  const gameColor2 = watch("gameColor2");

  let adminId = decodeToken(auth?.accessToken);

  const onUpdateShopSuccess = async () => {
    await queryClient.invalidateQueries(["adminShops"]);
    toast("Game color updated!", "success");
  };

  const onUpdateShopError = (error) => {
    console.log(error);
    toast("Failed to update game color!", "error");
  };

  const updateShopMutation = useMutation({
    mutationFn: async (data) =>
      await updateShop(axiosPrivate, shopId, adminId, data),
    onSuccess: onUpdateShopSuccess,
    onError: onUpdateShopError,
  });

  const onSubmit = (values) => {
    if (!!adminId) {
      updateShopMutation.mutate(values);
    }
  };

  useEffect(() => {
    if (shop) {
      methods.reset({
        gameColor1: shop.gameColor1 || "#0000ff",
        gameColor2: shop.gameColor2 || "#ff0000",
      });
    }
  }, [shop]);

  return (
    <AdminSection
      title="Customize your game"
      description="Upload your logo and choose your colors to create a game that reflects your brand.
  Offer your customers a unique, fully customized experience."
    >
      <Flex
        direction={{ base: "column", md: "column" }}
        justify="space-between"
        align="center"
        gap={8}
      >
        <Flex
          direction="column"
          p={14}
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          gap={[20, 10]}
          align="center"
          w="100%"
          h="100%"
        >
          <Heading size="sm">Your Logo</Heading>
          <Box boxSize="180px">
            <Image src={gameImg} alt="Logo" borderRadius="md" />
          </Box>

          {HAS_LOGO ? (
            <Button size="md" colorScheme="primary" variant="outline">
              Delete Logo
            </Button>
          ) : (
            <Button size="md" colorScheme="secondary">
              Add a Logo
            </Button>
          )}
        </Flex>
        <FormProvider {...methods}>
          <Flex
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            direction="column"
            p={14}
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            gap={14}
            align="center"
            w="100%"
          >
            <Heading size="sm">Choose your colors</Heading>
            <Flex direction={{ base: "column", lg: "row" }}>
              <TwoColorPicker />

              <Flex direction="column" justify="center" gap={8}>
                <Flex
                  gap={6}
                  mt={6}
                  w="100%"
                  justify="center"
                  align="center"
                  wrap="wrap"
                >
                  <Flex direction="column" align="center" gap={2}>
                    <Box
                      w="70px"
                      h="70px"
                      borderRadius="2xl"
                      bg={gameColor1}
                      border="2px solid"
                      borderColor="gray.300"
                      boxShadow="md"
                    />
                    <Text fontWeight="medium" color="gray.600">
                      Primary
                    </Text>
                  </Flex>

                  <Flex direction="column" align="center" gap={2}>
                    <Box
                      w="70px"
                      h="70px"
                      borderRadius="2xl"
                      bg={gameColor2}
                      border="2px solid"
                      borderColor="gray.300"
                      boxShadow="md"
                    />
                    <Text fontWeight="medium" color="gray.600">
                      Secondary
                    </Text>
                  </Flex>
                </Flex>
                <Flex justify="center">
                  <Button size="sm" variant="outline" colorScheme="primary">
                    Show Preview
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <Flex w="full" justify="end">
              <Button
                type="submit"
                colorScheme="primary"
                isLoading={updateShopMutation.isPending}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </FormProvider>
      </Flex>
    </AdminSection>
  );
};

export default CustomizeGame;
