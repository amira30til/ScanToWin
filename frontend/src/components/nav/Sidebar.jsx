import { useLogout } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

import { getActionsByShop } from "@/services/actionService";

import Logo from "../Logo";

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
  Spinner,
} from "@chakra-ui/react";

import {
  MdKeyboardArrowRight,
  MdOutlineSpaceDashboard,
  // MdMessage,
  MdAccountCircle,
} from "react-icons/md";
import {
  FaFolderOpen,
  // FaStar,
  FaGoogle,
  FaInstagram,
  FaTiktok,
  FaFacebook,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { AddIcon } from "@chakra-ui/icons";

const actionMap = {
  "Avis Google": { icon: FaGoogle, link: "google" },
  Facebook: { icon: FaFacebook, link: "facebook" },
  Instagram: { icon: FaInstagram, link: "instagram" },
  Tiktok: { icon: FaTiktok, link: "tiktok" },
};

const Sidebar = ({ shops, children }) => {
  return (
    <Box w="sidebar">
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
        bg="secondary.100"
        color="secondary.800"
        position="fixed"
        top="0"
        aria-label="Menu"
        display={{
          base: "inline-flex",
          md: "none",
        }}
        onClick={sidebar.onOpen}
        icon={<FiMenu />}
        size="sm"
        my={4}
        mx={8}
        zIndex="5"
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton zIndex="5" />
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SidebarContent = ({ shops, ...rest }) => {
  const integrations = useDisclosure({ defaultIsOpen: true });
  const { shopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const logout = useLogout();

  const { data: actionsByShop, isLoading: actionsByShopIsLoading } = useQuery({
    queryKey: ["actions-by-shop", shopId],
    queryFn: async () => {
      const response = await getActionsByShop(shopId);
      return response.data.data.chosenActions;
    },
    enabled: !!shopId,
  });

  const handleShopChange = (event) => {
    const newShopId = event.target.value;
    if (newShopId !== shopId) {
      const newPath = location.pathname.replace(shopId, newShopId);
      navigate(newPath);
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
      overflow="hidden auto"
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
            value={shopId}
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
          href={`${shopId}/dashboard/${queryString}`}
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

        {actionsByShopIsLoading && (
          <Flex justify="center">
            <Spinner color="secondary.500" />
          </Flex>
        )}

        <Collapse in={integrations.isOpen}>
          {actionsByShop?.map((action, index) => {
            const IconComponent = actionMap[action.name];
            return (
              <NavItem
                key={index}
                icon={IconComponent.icon}
                pl="10"
                py="2"
                href={`${shopId}/${IconComponent.link}/${queryString}`}
              >
                {action.name}
              </NavItem>
            );
          })}
        </Collapse>
        <NavItem icon={FaFolderOpen} href={`${shopId}/campaign`} boxSize={4}>
          My Campaign
        </NavItem>
        {/* <NavItem icon={MdMessage} href={`${shopId}/sms`} boxSize={4}>
          SMS Campaign
        </NavItem>
        <NavItem icon={FaStar} href={`${shopId}/review`} boxSize={4}>
          Manage Reviews
        </NavItem> */}
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
  const cleanHref = href?.split("?")[0];

  const isActive =
    hasHref &&
    (urlPath === `/admin/${cleanHref}` ||
      urlPath.startsWith(`/admin/${cleanHref}/`));

  const isActiveColor = "primary.700";

  if (isActive) {
    rest.color = isActiveColor;
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
