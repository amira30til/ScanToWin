// HOOKS
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCopy } from "@/hooks";
import useAuthStore from "@/store";

// COMPONENTS
import IconButton from "@/components/common/IconButton";
import DataTable from "@/components/DataTable";
import AdminSection from "@/components/common/AdminSection";
import CustomizeGame from "./CustomizeGame";

// STYLE
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Image,
  Td,
  FormControl,
  FormLabel,
  Switch,
  Link,
  // useToken,
} from "@chakra-ui/react";

// ASSETS
import gameImg from "@/assets/game.jpeg";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
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

const GIFTS = [
  {
    icon: AddIcon,
    name: "Drink",
    winnerCount: 2,
    isUnlimited: true,
  },
  {
    icon: AddIcon,
    name: "Pizza",
    winnerCount: 0,
    isUnlimited: false,
  },
  {
    icon: AddIcon,
    name: "Drink",
    winnerCount: 2,
    isUnlimited: true,
  },
];

const GAMES = [
  {
    title: "Spin the Wheel",
    description: "A classic wheel of fortune game",
    image: gameImg,
    isSelected: true,
  },
  {
    title: "Spin the Wheel",
    description: "A classic wheel of fortune game",
    image: gameImg,
    isSelected: false,
  },
  {
    title: "Spin the Wheel",
    description: "A classic wheel of fortune game",
    image: gameImg,
    isSelected: false,
  },
];

const AdminCampaign = () => {
  const shop = useAuthStore((state) => state.shop);

  useEffect(() => {
    console.log("campaign", shop);
  }, [shop]);

  return (
    <Box pos="relative" w="100%">
      <Header />

      <Flex direction="column" gap={10} h="3400px" px={8} py={10}>
        <Actions />

        <Games />

        <CustomizeGame shop={shop} />

        <Gifts />
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

const Games = () => {
  const Game = ({ game }) => {
    const borderColor = game.isSelected ? "primary.500" : "gray.300";
    const border = game.isSelected ? "2px" : "1px";

    return (
      <Flex
        direction="column"
        border={border}
        borderColor={borderColor}
        borderRadius="3xl"
        gap={6}
        p={8}
        // maxW="325px"
        // maxH="325px"
        justify="center"
        align="center"
        transition="all 0.1s ease-in-out"
        _hover={{
          borderColor: "primary.500",
          cursor: "pointer",
          transform: "translateY(-8px)",
          shadow: "xl",
          transition: "all 0.1s ease-in-out",
          bg: "white",
        }}
      >
        <Flex direction="column" gap={1} justify="center" align="center">
          <Text fontWeight="bold">{game.title}</Text>
          <Text fontSize="sm" color="gray">
            {game.description}
          </Text>
        </Flex>
        <Image
          borderRadius="full"
          src={game.image}
          // maxW="200px"
          // maxH="200px"
        ></Image>
      </Flex>
    );
  };

  return (
    <AdminSection
      title="Game selection"
      description="Choose from 3 interactive games to engage your users and create a
unique experience."
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={8}
      >
        {GAMES?.map((game, index) => (
          <Game key={index} game={game} />
        ))}
      </Flex>
    </AdminSection>
  );
};

const Gifts = () => {
  const headers = ["name", "winner count", "is unlimited", "actions"];

  const rows = (gift) => (
    <>
      <Td>
        <Flex align="center" gap={2}>
          <AddIcon color="primary.500" />
          <Flex fontWeight="bold">{gift.name}</Flex>
        </Flex>
      </Td>

      <Td>{gift.winnerCount}</Td>

      <Td>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="is-unlimited" mb="0" fontSize="xs">
            unlimited
          </FormLabel>
          <Switch
            id="is-unlimited"
            colorScheme="primary"
            size="sm"
            // defaultValue={gift.isUnlimited}
            defaultChecked={gift.isUnlimited}
            // {...register("isUnlimited")}
          />
        </FormControl>
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
          <Flex>
            <IconButton
              label="Edit gift"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              colorScheme="orange"
              // onClick={() => editGiftHandler(gift?.id)}
            />
          </Flex>
        </Flex>
      </Td>
    </>
  );

  return (
    <AdminSection
      title="Choose gifts"
      description="Choose the rewards your customers can win by playing. Customize your prizes to offer a unique and engaging experience."
    >
      <Flex direction="column" gap={4}>
        <Flex>
          <Button
            leftIcon={<AddIcon />}
            variant="solid"
            colorScheme="secondary"
            size="sm"
            // onClick={addGiftHandler}
          >
            Add a gift
          </Button>
        </Flex>

        <DataTable
          rows={rows}
          headers={headers}
          data={GIFTS}
          bg="surface.navigation"
        />
      </Flex>
    </AdminSection>
  );
};

export default AdminCampaign;
