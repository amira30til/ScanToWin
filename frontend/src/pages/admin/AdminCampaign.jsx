import { useState } from "react";
import TwoColorPicker from "@/components/TwoColorPicker";
import IconButton from "@/components/common/IconButton";

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
import gameImg from "@/assets/game.jpeg";
import DataTable from "@/components/DataTable";
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

const HAS_LOGO = true;

const AdminCampaign = () => {
  return (
    <Box pos="relative" w="100%">
      <Header />

      <Flex direction="column" gap={10} h="3400px" px={8} py={10}>
        <Actions />

        <Games />

        <CustomizeGame />

        <Gifts />
      </Flex>
    </Box>
  );
};

const Header = () => (
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
      <Flex gap={2}>
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
            <MenuItem>
              <Button
                leftIcon={<CopyIcon />}
                size="sm"
                variant="outline"
                colorScheme="primary"
                w="full"
              >
                Copy QR Link
              </Button>
            </MenuItem>
            <MenuItem>
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

        <Td as={Flex} align="center" gap={2}>
          <IconComponent
          //  color={primary500}
          />

          <Flex fontWeight="bold">{action.name}</Flex>
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
    <Section
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
    </Section>
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
    <Section
      title="Game selection"
      description="Choose from 3 interactive games to engage your users and create a
unique experience."
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={8}
      >
        {GAMES?.map((game) => (
          <Game game={game} />
        ))}
      </Flex>
    </Section>
  );
};

const CustomizeGame = () => {
  const [primary, setPrimary] = useState("#615EFC");
  const [secondary, setSecondary] = useState("#FF66C4");
  return (
    <Section
      title="Customize your game"
      description="Upload your logo and choose your colors to create a game that reflects your brand.
Offer your customers a unique, fully customized experience."
    >
      <Flex
        direction={{ base: "column", md: "column" }}
        // w="100%"
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
          // w={{ base: "100%", lg: "20%" }}
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

        <Flex
          direction="column"
          p={14}
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          gap={14}
          align="center"
          w={{ base: "100%", lg: "100%" }}
        >
          <Heading size="sm">Choose your colors</Heading>

          <Flex direction={{ base: "column", lg: "row" }}>
            <TwoColorPicker
              primary={primary}
              secondary={secondary}
              setPrimary={setPrimary}
              setSecondary={setSecondary}
            />

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
                    bg={primary}
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
                    bg={secondary}
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
        </Flex>
      </Flex>
    </Section>
  );
};

const Gifts = () => {
  const headers = ["name", "winner count", "is unlimited", "actions"];

  const rows = (gift) => (
    <>
      <Td as={Flex} align="center" gap={2}>
        <AddIcon color="primary.500" />
        <Flex fontWeight="bold">{gift.name}</Flex>
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
    <Section
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
    </Section>
  );
};

const Section = ({ title, description, children }) => {
  return (
    <Flex
      direction="column"
      gap={10}
      bg="surface.navigation"
      padding={10}
      border="2px"
      borderColor="gray.100"
      borderRadius="md"
    >
      <Flex direction="column" gap={2}>
        <Heading size="md">{title}</Heading>
        <Text color="gray.500">{description}</Text>
      </Flex>

      {children}
    </Flex>
  );
};

export default AdminCampaign;
