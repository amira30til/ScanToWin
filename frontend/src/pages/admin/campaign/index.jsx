import useAuthStore from "@/store";
import CustomizeGame from "./CustomizeGame";
import ChooseGame from "./ChooseGame";
import { Flex, Box } from "@chakra-ui/react";
import Rewards from "./rewards";
import Actions from "./Actions";
import HeaderAdmin from "@/components/HeaderAdmin";

const AdminCampaign = () => {
  const shop = useAuthStore((state) => state.shop);

  return (
    <Box pos="relative">
      <HeaderAdmin title="My Campaign" />
      <Flex direction="column" gap={10} h="3400px" px={8} py={10}>
        <Actions />
        <ChooseGame shop={shop} />
        <CustomizeGame shop={shop} />
        <Rewards />
      </Flex>
    </Box>
  );
};

export default AdminCampaign;
