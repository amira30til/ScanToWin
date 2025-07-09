import { useParams } from "react-router-dom";
import { useCopy } from "@/hooks";
import useAuthStore from "@/store";

import CustomizeGame from "./CustomizeGame";
import ChooseGame from "./ChooseGame";

import { Box, Flex, Heading, Button } from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
  DownloadIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import { FaLock, FaQrcode } from "react-icons/fa";
import { FaFloppyDisk } from "react-icons/fa6";
import Rewards from "./rewards";
import Actions from "./Actions";

const AdminCampaign = () => {
  const shop = useAuthStore((state) => state.shop);

  return (
    <Box pos="relative">
      <Header />

      <Flex direction="column" gap={10} h="3400px" px={8} py={10}>
        <Actions />

        <ChooseGame shop={shop} />

        <CustomizeGame shop={shop} />

        <Rewards />
      </Flex>
    </Box>
  );
};

const Header = () => {
  const { shopId } = useParams();
  const [_, copy] = useCopy();

  const copyQrLinkHandler = () => {
    const qrCodeLink = `${import.meta.env.VITE_FRONTEND_URL}/play/${shopId}`;
    copy(qrCodeLink);
  };

  return (
    <Box
      position="sticky"
      top="0"
      bg="surface.navigation"
      shadow="sm"
      w="100%"
      zIndex="10"
      px={8}
      py={4}
    >
      <Flex justify="space-between" align="center">
        <Heading size="lg">My Campaign</Heading>
        <Flex direction={{ sm: "column", md: "row" }} gap={2}>
          <Button
            leftIcon={<FaLock />}
            size="sm"
            colorScheme="secondary"
            variant="outline"
          >
            My PIN Code
          </Button>

          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<FaQrcode />}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              colorScheme="secondary"
            >
              QR Code
            </MenuButton>
            <MenuList>
              <MenuItem as="div">
                <Button
                  leftIcon={<CopyIcon />}
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  w="full"
                  onClick={copyQrLinkHandler}
                >
                  Copy QR Link
                </Button>
              </MenuItem>
              <MenuItem as="div">
                <Button
                  leftIcon={<DownloadIcon />}
                  size="sm"
                  colorScheme="primary"
                  w="full"
                >
                  Download QR Code
                </Button>
              </MenuItem>
            </MenuList>
          </Menu>

          <Button leftIcon={<FaFloppyDisk />} size="sm" colorScheme="primary">
            Save
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminCampaign;
