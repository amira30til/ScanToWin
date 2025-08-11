import { useForm } from "react-hook-form";
import { useToast, useLocalStorage } from "@/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- Add this line

import { yupResolver } from "@hookform/resolvers/yup";
import { redeemCodeSchema } from "@/schemas/reward/redeemCode";
import { getShop, verifyShopCodePin } from "@/services/shopService";

import UserCooldownModal from "./components/UserCooldownModal";

import {
  Flex,
  Box,
  HStack,
  PinInput,
  PinInputField,
  Heading,
  Text,
  VStack,
  Button,
  Image,
} from "@chakra-ui/react";

import logo from "@/assets/logo.png";

const Redeem = () => {
  const { t } = useTranslation();
  const { shopId, actionId, userId } = useParams();
  const navigate = useNavigate();
  const [_, setUserId] = useLocalStorage("s2w_user_id", "");
  const queryClient = useQueryClient();

  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(redeemCodeSchema),
  });

  const { data: shop } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  const verifyShopCodePinMutation = useMutation({
    mutationFn: async (values) => await verifyShopCodePin(values),
    onSuccess: (data) => {
      if (data?.data?.error?.code === "USER_COOLDOWN") {
        toast("You have to wait 24h before getting the reward!", "error");
        setUserId(data.data.error.userId);
        queryClient.refetchQueries([
          "verify-user-cooldown",
          shopId,
          data.data.error.userId,
        ]);
        return;
      }
      if (data?.data?.data?.isValid === false) {
         toast(t("redeem.toast.invalid"), "error");

      } else {
        toast(t("redeem.toast.success"), "success");
        navigate(`/user/${shopId}`);
      }
    },

    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const onSubmit = (values) => {
    const fullCode = `${values.digitOne}${values.digitTwo}${values.digitThree}${values.digitFour}`;
    if (!!shopId && !!userId && !!actionId) {
      verifyShopCodePinMutation.mutate({
        gameCodePin: fullCode,
        shopId,
        actionId,
        userId,
      });
    }
  };

  return (
    <>
      <Flex h="100vh" w="100vw" bg="gray.50" align="center" justify="center">
        <VStack
          as="form"
          textAlign="center"
          spacing={12}
          maxW="md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box>
            <Image
              objectFit="cover"
              src={shop?.logo ?? logo}
              alt="logo"
              h="auto"
              w="80px"
            />
          </Box>
          <Heading as="h1" fontSize="xl" letterSpacing="tight">
            {t("redeem.title")}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {t("redeem.subtitle")}
          </Text>
          <HStack>
            <PinInput
              size="lg"
              focusBorderColor={shop?.gameColor2 || "primary.500"}
              autoFocus
            >
              <PinInputField borderColor="gray.500" {...register("digitOne")} />
              <PinInputField borderColor="gray.500" {...register("digitTwo")} />
              <PinInputField
                borderColor="gray.500"
                {...register("digitThree")}
              />
              <PinInputField
                borderColor="gray.500"
                {...register("digitFour")}
              />
            </PinInput>
          </HStack>
          {errors?.[""]?.message && (
            <Text fontSize="sm" color="red">
              {errors?.[""]?.message}
            </Text>
          )}
          <Button
            type="submit"
            bg={shop?.gameColor1 || "primary.500"}
            color="#fff"
            _hover={{
              opacity: 0.8,
            }}
            isLoading={verifyShopCodePinMutation.isLoading}
          >
            {t("redeem.submit")}
          </Button>
        </VStack>
      </Flex>
      <UserCooldownModal
        title={t("redeem.cooldown.title")}
        description={t("redeem.cooldown.description")}
      />
    </>
  );
};

export default Redeem;
