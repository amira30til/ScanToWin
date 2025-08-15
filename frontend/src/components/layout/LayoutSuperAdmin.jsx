import { useLogout } from "@/hooks";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Flex,
  Box,
  Button,
  Avatar,
  Icon,
  useColorModeValue,
  VStack,
  Text,
  Divider,
  HStack,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FiLogOut,
  FiUsers,
  FiSettings,
  FiPackage,
  FiActivity,
  FiChevronDown,
  FiTrendingUp,
  FiClock,
  FiShield,
  FiUser,
} from "react-icons/fi";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react";

const LayoutSuperAdmin = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarBg = useColorModeValue("white", "gray.700");
  const activeLinkBg = useColorModeValue("primary.50", "primary.900");
  const activeLinkColor = useColorModeValue("primary.600", "primary.200");
  const borderColor = useColorModeValue("surface.divider", "gray.600");

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItemsMain = [
    { path: "/super-admin/admins", icon: FiUsers, label: "Admins" },
    { path: "/super-admin/actions", icon: FiActivity, label: "Actions" },
    { path: "/super-admin/games", icon: FiPackage, label: "Games" },
  ];

  const navItemsSettings = [
    { path: "/super-admin/settings", icon: FiSettings, label: "Settings" },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Flex minH="100vh" bg={useColorModeValue("background", "gray.900")}>
      {/* Sidebar */}
      <Box
        w={{ base: "70px", md: "260px" }}
        bg={sidebarBg}
        boxShadow="card"
        position="fixed"
        top={0}
        h="100vh"
        zIndex={10}
        borderRight="1px solid"
        borderColor={borderColor}
        overflowY="auto"
        p={4}
      >
        <Flex direction="column" h="full">
          {/* Logo */}
          <Flex justify="center" mb={6}>
            <Logo h="150px" w="auto" />
          </Flex>

          {/* Main Navigation */}
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
            mb={2}
            display={{ base: "none", md: "block" }}
          >
            Main Menu
          </Text>
          <VStack spacing={4} align="stretch" mb={6}>
            {navItemsMain.map((item) => (
              <Button
                key={item.path}
                as={Link}
                to={item.path}
                variant="ghost"
                justifyContent={{ base: "center", md: "flex-start" }}
                leftIcon={<Icon as={item.icon} boxSize={6} />}
                isActive={location.pathname === item.path}
                _active={{
                  bg: activeLinkBg,
                  color: activeLinkColor,
                  fontWeight: "semibold",
                  borderRadius: "md",
                }}
                _hover={{
                  bg: "primary.50",
                  borderRadius: "md",
                  transform: "scale(1.02)",
                  transition: "all 0.15s ease",
                }}
                size="lg"
                h="60px"
                px={4}
                borderRadius="md"
              >
                <Text
                  display={{ base: "none", md: "block" }}
                  fontSize="lg"
                  fontWeight="medium"
                >
                  {item.label}
                </Text>
              </Button>
            ))}
          </VStack>

          {/* Footer */}
          <Box mt="auto" pt={4}>
            <Divider my={4} borderColor={borderColor} />
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name="Super Admin"
                bg="primary.500"
                color="white"
                fontWeight="bold"
              />
              <Box flex={1} display={{ base: "none", md: "block" }}>
                <Text fontSize="sm" fontWeight="medium">
                  Super Admin
                </Text>
                <Text fontSize="xs" color="text.secondary">
                  Administrator
                </Text>
              </Box>
              <IconButton
                variant="ghost"
                colorScheme="primary"
                size="sm"
                onClick={signOut}
                icon={<Icon as={FiLogOut} />}
                aria-label="Sign out"
              />
            </HStack>
          </Box>
        </Flex>
      </Box>

      {/* Main Content */}
      <Flex
        direction="column"
        flex={1}
        ml={{ base: "70px", md: "260px" }}
        minH="100vh"
      >
        {/* Header */}
        <Box
          as="header"
          w="100%"
          bgGradient="linear(135deg, primary.500 0%, secondary.500 100%)"
          borderBottom="4px solid"
          borderColor={borderColor}
          position="sticky"
          top={0}
          zIndex={5}
          px={{ base: 4, md: 6 }}
          py={6}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={6}
            alignItems="start"
          >
            <GridItem>
              <VStack align="flex-start" spacing={3}>
                <HStack spacing={3}>
                  <Icon
                    as={FiShield}
                    boxSize={6}
                    color="white"
                    bg="whiteAlpha.200"
                    p={1}
                    borderRadius="md"
                  />
                  <Text
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color="white"
                  >
                    {getGreeting()}, Super Admin
                  </Text>
                </HStack>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.900"
                >
                  Manage your platform with precision and control.
                </Text>
                <HStack spacing={4}>
                  <Badge
                    bg="whiteAlpha.200"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <Icon as={FiTrendingUp} boxSize={3} mr={1} /> System Active
                  </Badge>
                  <Badge
                    bg="whiteAlpha.200"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <Icon as={FiShield} boxSize={3} mr={1} /> All Secure
                  </Badge>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="stretch" spacing={4}>
                <HStack justify="flex-end" spacing={4}>
                  <Box>
                    <LanguageSwitcher />
                  </Box>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      p={0}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="whiteAlpha.400"
                      bg="whiteAlpha.200"
                      _hover={{
                        bg: "whiteAlpha.300",
                        borderColor: "whiteAlpha.500",
                      }}
                      _active={{
                        bg: "whiteAlpha.300",
                      }}
                      transition="all 0.2s"
                      px={2}
                      py={1}
                    >
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          name="Super Admin"
                          bg="primary.500"
                          color="white"
                        />
                        <Icon
                          as={FiChevronDown}
                          boxSize={4}
                          color="whiteAlpha.800"
                        />
                      </HStack>
                    </MenuButton>
                    <MenuList
                      borderRadius="md"
                      border="1px solid"
                      borderColor="whiteAlpha.400"
                      bg="whiteAlpha.200"
                      py={1}
                      minW="180px"
                      _hover={{
                        bg: "whiteAlpha.300",
                        borderColor: "whiteAlpha.500",
                      }}
                    >
                      <MenuItem
                        icon={<FiUser />}
                        bg="transparent"
                        _hover={{ bg: "whiteAlpha.300" }}
                      >
                        View Profile
                      </MenuItem>

                      <MenuDivider borderColor="whiteAlpha.400" />
                      <MenuItem
                        icon={<FiLogOut />}
                        onClick={signOut}
                        color="feedback.error"
                        bg="transparent"
                        _hover={{ bg: "whiteAlpha.300" }}
                      >
                        Sign Out
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>

                <Box
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderRadius="xl"
                  p={5}
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                >
                  <HStack spacing={2} mb={2}>
                    <Icon as={FiClock} boxSize={4} color="white" />
                    <Text fontSize="sm" color="whiteAlpha.900">
                      Current Time
                    </Text>
                  </HStack>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="white"
                    fontFamily="mono"
                  >
                    {formatTime(currentTime)}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    {formatDate(currentTime)}
                  </Text>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* Page Content */}
        <Box flex={1} overflow="auto" p={{ base: 4, md: 6 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default LayoutSuperAdmin;
