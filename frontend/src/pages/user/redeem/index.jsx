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
import { useForm } from "react-hook-form";

import UserCooldownModal from "../components/UserCooldownModal";

import { yupResolver } from "@hookform/resolvers/yup";
import { redeemCodeValidator } from "@/validators/redeemCodeValidator";
import { useParams } from "react-router-dom";
import { getShop, verifyShopCodePin } from "@/services/shopService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks";

const Redeem = () => {
  const { shopId } = useParams();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(redeemCodeValidator),
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
      console.log(data);
      if (data.data.data.isValid === false) {
        toast("Invalid code pin!", "error");
      } else {
        toast("You won congrats!", "success");
      }
    },
    onError: () => {},
  });

  const onSubmit = (values) => {
    // TODO: call the verifyRedeemCode endpoint
    // give to backend:
    // 1. "userId" (for security and side effect)
    // 2. "shopId" and "pin Code" for checking

    const fullCode = `${values.digitOne}${values.digitTwo}${values.digitThree}${values.digitFour}`;

    if (!!shopId) {
      verifyShopCodePinMutation.mutate({ gameCodePin: +fullCode, shopId });
    }
  };

  // useEffect(() => {
  // get shopId infos + reward Info's
  // call getReward by providing userId + shopId
  // how to get acess to "last won reward"
  // }, []);

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
              src={shop?.logo ?? ""}
              alt="logo"
              h="auto"
              w="80px"
            />
          </Box>
          <Heading as="h1" fontSize="xl" letterSpacing="tight">
            You reward is waiting for you! <br /> "Your Reward"
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Show this page to the staff and enter the code given to you.
          </Text>
          <HStack>
            <PinInput size="lg" focusBorderColor="primary.500" autoFocus>
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
            colorScheme="primary"
            isLoading={verifyShopCodePinMutation.isLoading}
          >
            Submit
          </Button>
        </VStack>
      </Flex>
      <UserCooldownModal
        title="24h haven't passed yet!"
        description="you can get your gift in:"
      />
    </>
  );
};

export default Redeem;
