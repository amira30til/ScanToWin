// HOOKS
import { useParams } from "react-router-dom";
import { useCopy } from "@/hooks";
import useAuthStore from "@/store";

// COMPONENTS
import IconButton from "@/components/common/IconButton";
import DataTable from "@/components/DataTable";
import AdminSection from "@/components/common/AdminSection";
import CustomizeGame from "./CustomizeGame";
import ChooseGame from "./ChooseGame";

// STYLE
import {
  Box,
  Flex,
  Heading,
  Button,
  Td,
  Link,
  // useToken,
} from "@chakra-ui/react";

// ASSETS
import {
  AddIcon,
  DeleteIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
  DownloadIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import {
  FaFacebook,
  FaTiktok,
  FaGoogle,
  FaLock,
  FaQrcode,
} from "react-icons/fa";
import { FaFloppyDisk } from "react-icons/fa6";
import Rewards from "./rewards";

const ACTIONS = [
  {
    position: 1,
    name: "Google",
    icon: "google",
    targetLink: "https://www.google.com/maps",
  },
  {
    position: 2,
    name: "Google",
    icon: "facebook",
    targetLink: "https://www.google.com/maps",
  },
  {
    position: 3,
    name: "Google",
    icon: "tiktok",
    targetLink: "https://www.google.com/maps",
  },
];

const AdminCampaign = () => {
  const shop = useAuthStore((state) => state.shop);

  return (
    <Box pos="relative" w="100%">
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

const Actions = () => {
  const headers = ["Order", "Action", "link", "actions"];

  const iconMap = {
    facebook: FaFacebook,
    tiktok: FaTiktok,
    google: FaGoogle,
  };

  // const [primary500] = useToken("colors", ["primary.500"]);

  const rows = (action) => {
    const IconComponent = iconMap[action.icon] || AddIcon;

    return (
      <>
        <Td>{action.position}</Td>

        <Td>
          <Flex align="center" gap={2}>
            <IconComponent
            //  color={primary500}
            />

            <Flex fontWeight="bold">{action.name}</Flex>
          </Flex>
        </Td>

        <Td>
          <Link size="sm">{action.targetLink}</Link>
        </Td>

        <Td>
          <Flex>
            <Flex>
              <IconButton
                label="Delete gift"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                // onClick={() => deleteGiftHandler(gift?.id)}
              />
            </Flex>
          </Flex>
        </Td>
      </>
    );
  };

  return (
    <AdminSection
      title="Choose actions"
      description="Define the order and actions your customers need to take to maximize engagement."
    >
      <Flex direction="column" gap={4}>
        <DataTable
          rows={rows}
          headers={headers}
          data={ACTIONS}
          bg="surface.navigation"
        />
      </Flex>
    </AdminSection>
  );
};

export default AdminCampaign;
