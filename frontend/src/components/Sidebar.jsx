import { useLogout } from "@/hooks";
import Logo from "./Logo";

// STYLE
import {
  useDisclosure,
  Box,
  Flex,
  Icon,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  DrawerCloseButton,
  Divider,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";

// ASSETS
import {
  MdKeyboardArrowRight,
  MdOutlineSpaceDashboard,
  MdMessage,
  MdAccountCircle,
} from "react-icons/md";
import {
  FaFolderOpen,
  FaStar,
  FaGoogle,
  FaInstagram,
  FaTiktok,
  FaFacebook,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import useAuthStore from "@/store";
import { AddIcon } from "@chakra-ui/icons";

const Sidebar = ({ shops, children }) => {
  return (
    <Box w="100%">
      <DrawerElement />
      <Flex as="section" minH="100vh" w="100%">
        <SidebarContent
          display={{
            base: "none",
            md: "unset",
          }}
          shops={shops}
        />
        <Box
          ml={{
            base: 0,
            md: 60,
          }}
          transition=".3s ease"
          w="100%"
        >
          <Box as="main" bg="surface.main" h="100%">
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

const DrawerElement = () => {
  const sidebar = useDisclosure();
  return (
    <>
      <IconButton
        aria-label="Menu"
        display={{
          base: "inline-flex",
          md: "none",
        }}
        onClick={sidebar.onOpen}
        icon={<FiMenu />}
        size="sm"
        m="4"
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton zIndex={1101} />
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SidebarContent = ({ shops, ...rest }) => {
  const integrations = useDisclosure({ defaultIsOpen: true });
  const navigate = useNavigate();
  const logout = useLogout();
  const { shopId } = useParams();
  const { shopId: currentShopId } = useParams();
  const setFullShop = useAuthStore((state) => state.setFullShop);

  const handleShopChange = (event) => {
    const newShopId = event.target.value;
    if (newShopId !== currentShopId) {
      navigate(`/admin/${newShopId}/dashboard`);
    }

    const shop = shops?.find((shop) => shop.id === newShopId);
    if (shop) {
      setFullShop({ shop });
    }
  };

  const handleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    integrations.onToggle();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="surface.navigation"
      border
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...rest}
    >
      <Flex px="4" py="5" align="center" justify="center">
        <Logo w="100px" />
      </Flex>
      <VStack align="stretch" spacing={3} w="100%" px={4}>
        <Button
          leftIcon={<AddIcon />}
          size="sm"
          colorScheme="primary"
          onClick={() => navigate("/admin/create-shop")}
        >
          Add Shop
        </Button>
        {shops && (
          <Select
            value={currentShopId}
            onChange={handleShopChange}
            bg="white"
            borderRadius="md"
            fontWeight="bold"
            focusBorderColor="primary.500"
            cursor="pointer"
          >
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Select>
        )}
      </VStack>

      <Flex justify="center">
        <Divider w="80%" my={4} h="1px" bg="gray.300" />
      </Flex>

      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem
          icon={MdOutlineSpaceDashboard}
          href={`${shopId}/dashboard`}
          boxSize={5}
        >
          Dashboard
          <IconButton
            ml="auto"
            size="xs"
            p={0}
            variant="outline"
            onClick={handleDropdown}
            icon={
              <Icon
                as={MdKeyboardArrowRight}
                transform={integrations.isOpen && "rotate(90deg)"}
              />
            }
          ></IconButton>
        </NavItem>
        <Collapse in={integrations.isOpen}>
          <NavItem icon={FaGoogle} pl="10" py="2" href={`${shopId}/google`}>
            Google Reviews
          </NavItem>
          <NavItem
            icon={FaInstagram}
            pl="10"
            py="2"
            href={`${shopId}/instagram`}
          >
            Instagram
          </NavItem>
          <NavItem icon={FaTiktok} pl="10" py="2" href={`${shopId}/tiktok`}>
            TikTok
          </NavItem>
          <NavItem icon={FaFacebook} pl="10" py="2" href={`${shopId}/facebook`}>
            Facebook
          </NavItem>
          <NavItem icon={FaUsers} pl="10" py="2" href={`${shopId}/usersdata`}>
            Users Data
          </NavItem>
        </Collapse>
        <NavItem icon={FaFolderOpen} href={`${shopId}/campaign`} boxSize={4}>
          My Campaign
        </NavItem>
        <NavItem icon={MdMessage} href={`${shopId}/sms`} boxSize={4}>
          SMS Campaign
        </NavItem>
        <NavItem icon={FaStar} href={`${shopId}/review`} boxSize={4}>
          Manage Reviews
        </NavItem>
        <NavItem icon={FaUsers} href={`${shopId}/users`} boxSize={5}>
          My Users
        </NavItem>
        <NavItem icon={MdAccountCircle} href={`${shopId}/account`} boxSize={5}>
          Account
        </NavItem>
      </Flex>
      <Flex justify="center">
        <Divider w="80%" my={4} h="1px" bg="gray.300" />
      </Flex>
      <NavItem icon={BiLogOut} onClick={handleLogout} boxSize={5}>
        Logout
      </NavItem>
    </Box>
  );
};

const NavItem = (props) => {
  const { icon, children, href, boxSize, ...rest } = props;
  const hasHref = href !== undefined && href !== "";
  const urlPath = window.location.pathname;
  const isActive = hasHref && urlPath === `/admin/${href}`;

  const isActiveColor = "primary.700";

  if (isActive) {
    rest.color = isActiveColor;
    // rest.color = "gray.900";
    rest.bg = "primary.50";
  }

  return (
    <Flex
      as={hasHref ? Link : "div"}
      to={hasHref ? `/admin/${href}` : undefined}
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      color="inherit"
      _hover={{
        bg: "primary.50",
        color: isActive ? isActiveColor : "primary.600",
        // color: "gray.900",
      }}
      role="group"
      fontWeight="semibold"
      transition="all .15s ease"
      {...rest}
    >
      {icon && <Icon mx="2" boxSize={boxSize} as={icon} />}
      {children}
    </Flex>
  );
};

export default Sidebar;
