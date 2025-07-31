import CustomizeGame from "./CustomizeGame";
import ChooseGame from "./ChooseGame";
import { Flex, Box, Spinner } from "@chakra-ui/react";
import Rewards from "./rewards";
import Actions from "./actions";
import HeaderAdmin from "@/components/nav/HeaderAdmin";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShop } from "@/services/shopService";

const AdminCampaign = () => {
  const { shopId } = useParams();

  const { data: shop, shopIsLoading } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  if (shopIsLoading) return <Spinner color="secondary.500" />;

  return (
    <Box pos="relative">
      <HeaderAdmin title="My Campaign" />
      <Flex direction="column" gap={10} px={8} py={10} overflow-x="hidden">
        <Actions />
        <ChooseGame shop={shop} />
        <CustomizeGame shop={shop} />
        <Rewards />
      </Flex>
    </Box>
  );
};

export default AdminCampaign;
