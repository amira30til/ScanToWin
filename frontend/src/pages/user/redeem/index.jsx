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
} from "@chakra-ui/react";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { redeemCodeValidator } from "@/validators/redeemCodeValidator";
import { useParams } from "react-router-dom";
import { getShop } from "@/services/shopService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Redeem = () => {
  const { shopId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(redeemCodeValidator),
  });

  const { data: shop } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  const onSubmit = (values) => {
    // TODO: call the verifyRedeemCode endpoint
    // give to backend:
    // 1. "userId" (for security and side effect)
    // 2. "shopId" and "pin Code" for checking

    console.log(shop);
    console.log(values);
  };

  useEffect(() => {
    // get shopId infos + reward Info's
    // call getReward by providing userId + shopId
    // how to get acess to "last won reward"
  }, []);

  return (
    <Flex h="100vh" w="100vw" bg="gray.50" align="center" justify="center">
      <VStack
        as="form"
        textAlign="center"
        spacing={12}
        maxW="md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <Logo w="60px" />
          <Text>Shop Logo</Text>
        </Box>
        <Heading as="h1" fontSize="xl" letterSpacing="tight">
          You reward is waiting for you! <br /> "Your Reward"
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Show this page to the staff and enter the code given to you.
        </Text>
        <HStack>
          <PinInput size="lg" focusBorderColor="primary.500" autoFocus>
            <PinInputField borderColor="gray.500" {...register("digit-one")} />
            <PinInputField borderColor="gray.500" {...register("digit-two")} />
            <PinInputField
              borderColor="gray.500"
              {...register("digit-three")}
            />
            <PinInputField borderColor="gray.500" {...register("digit-four")} />
          </PinInput>
        </HStack>
        {errors?.[""]?.message && (
          <Text fontSize="sm" color="red">
            {errors?.[""]?.message}
          </Text>
        )}
        <Button type="submit" colorScheme="primary">
          Submit
        </Button>
      </VStack>
    </Flex>
  );
};

export default Redeem;
