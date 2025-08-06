import { useLogout } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

import { getActionsByShop } from "@/services/actionService";
import { startTransition } from "react";

import Logo from "../Logo";

import { Link } from "react-router-dom";
import {
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

import { FaGoogle, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import {
  Menu,
  Users,
  LogOut,
  FolderOpen,
  CircleUser,
  LayoutDashboard,
} from "lucide-react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";

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
          <Box as="main" bg="surface.main" h="100%" w="100vw">
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
        icon={<Menu />}
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
  const queryClient = useQueryClient();

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
    await queryClient.cancelQueries();
    startTransition(() => {
      navigate("/login");
    });
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
          icon={LayoutDashboard}
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
                as={ChevronDownIcon}
                transform={integrations.isOpen && "rotate(-180deg)"}
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
        <NavItem icon={FolderOpen} href={`${shopId}/campaign`} boxSize={4}>
          My Campaign
        </NavItem>
        <NavItem icon={Users} href={`${shopId}/users`} boxSize={5}>
          My Users
        </NavItem>
        <NavItem icon={CircleUser} href={`${shopId}/account`} boxSize={5}>
          Account
        </NavItem>
      </Flex>
      <Flex justify="center">
        <Divider w="80%" my={4} h="1px" bg="gray.300" />
      </Flex>
      <NavItem icon={LogOut} onClick={handleLogout} boxSize={5}>
        Logout
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, href, boxSize, ...rest }) => {
  const location = useLocation();
  const urlPath = location.pathname;

  const hasHref = href !== undefined && href !== "";

  const cleanHref = `/admin/${href?.split("?")[0]}`;
  const isActive = hasHref && cleanHref.startsWith(urlPath);

  return (
    <Flex
      as={hasHref ? Link : "div"}
      to={hasHref ? `/admin/${href}` : undefined}
      align="center"
      bg={isActive ? "primary.50" : undefined}
      color={isActive ? "primary.700" : undefined}
      p={3}
      cursor="pointer"
      fontWeight="semibold"
      transition="all .15s ease"
      _hover={{
        bg: "primary.50",
        color: isActive ? undefined : "primary.700",
      }}
      {...rest}
    >
      {icon && <Icon mx="2" boxSize={boxSize} as={icon} />}
      {children}
    </Flex>
  );
};

export default Sidebar;
