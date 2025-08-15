import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks";
import { useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getAdminById } from "@/services/adminService";
import { updateShop } from "@/services/shopService";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import IconButton from "@/components/common/IconButton";
import DeleteAdminModal from "./DeleteAdminModal";
import DeleteShopModal from "./DeleteShopModal";

import {
  Box,
  Heading,
  Flex,
  Button,
  Spinner,
  Text,
  Badge,
  SimpleGrid,
  Image,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Avatar,
  Divider,
  Tag,
  TagLabel,
  TagLeftIcon,
  useToast,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Mail, Phone, Archive, ArchiveRestore, Trash } from "lucide-react";

const AdminDetails = () => {
  const { t } = useTranslation();
  const { adminId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();

  const {
    onClose: onAdminClose,
    isOpen: isAdminOpen,
    onOpen: onAdminOpen,
  } = useDisclosure();
  const {
    onClose: onShopClose,
    isOpen: isShopOpen,
    onOpen: onShopOpen,
  } = useDisclosure();
  const [deleteShopId, setDeleteShopId] = useState("");

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const {
    data: admin,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-by-id", adminId],
    queryFn: async () => {
      const response = await getAdminById(axiosPrivate, adminId);
      return response.data.data;
    },
    enabled: !!adminId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch admin details",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/super-admin");
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: async ({ shopId, values }) =>
      await updateShop(axiosPrivate, shopId, adminId, values),
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shop",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const archiveShopHandler = (shopId) => {
    if (!!shopId && !!adminId) {
      updateShopMutation.mutate({ shopId, values: { status: "archived" } });
    }
  };

  const restoreShopHandler = (shopId) => {
    if (!!shopId && !!adminId) {
      updateShopMutation.mutate({
        shopId,
        values: { status: "active" },
      });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* Back Button */}
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        colorScheme="blue"
        onClick={() => navigate("/super-admin")}
        mb={6}
      >
        {t("adminDetails.goBack")}
      </Button>

      {/* Admin Profile Card */}
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        mb={8}
      >
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg">{t("adminDetails.title")}</Heading>
            <IconButton
              aria-label={t("adminDetails.deleteAdmin")}
              icon={<Trash size={18} />}
              size="sm"
              colorScheme="red"
              onClick={onAdminOpen}
            />
          </Flex>
        </CardHeader>

        <CardBody>
          <Stack spacing={4}>
            <Flex align="center" gap={4}>
              <Avatar
                name={admin?.email}
                size="lg"
                bg="blue.500"
                color="white"
              />
              <Box>
                <Flex align="center" gap={3} mb={2}>
                  <Tag colorScheme="blue" size="lg">
                    <TagLeftIcon as={Mail} />
                    <TagLabel>{admin?.email}</TagLabel>
                  </Tag>
                  {admin?.tel && (
                    <Tag colorScheme="teal" size="lg">
                      <TagLeftIcon as={Phone} />
                      <TagLabel>{admin?.tel}</TagLabel>
                    </Tag>
                  )}
                </Flex>
                <Badge
                  colorScheme={
                    admin?.adminStatus === "ACTIVE"
                      ? "green"
                      : admin?.adminStatus === "ARCHIVED"
                        ? "yellow"
                        : "gray"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {admin?.adminStatus}
                </Badge>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  {t("adminDetails.passwordVerificationCode")}
                </Text>
                <Text fontWeight="medium">2455{admin?.verificationCode}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  {t("adminDetails.createdAt")}
                </Text>
                <Text fontWeight="medium">
                  {admin?.createdAt &&
                    format(
                      parseISO(admin?.createdAt),
                      "MMMM d, yyyy à hh'h'mm",
                      {
                        locale: fr,
                      },
                    )}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  {t("adminDetails.lastUpdatedAt")}
                </Text>
                <Text fontWeight="medium">
                  {admin?.updatedAt &&
                    format(
                      parseISO(admin?.updatedAt),
                      "MMMM d, yyyy à hh'h'mm",
                      {
                        locale: fr,
                      },
                    )}
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </CardBody>
      </Card>

      {/* Shops Section */}
      <Heading size="lg" mb={6}>
        {t("adminDetails.shops")}
      </Heading>

      {admin?.shops?.length === 0 ? (
        <Card textAlign="center" py={10} bg={cardBg}>
          <Text fontSize="lg" color="gray.500">
            {t("adminDetails.noShopsYet")}
          </Text>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {admin?.shops?.map((shop) => (
            <Card
              key={shop.id}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              _hover={{ boxShadow: "md" }}
              transition="all 0.2s"
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{shop.name}</Heading>
                  <Flex gap={2}>
                    {shop.status === "active" ? (
                      <IconButton
                        aria-label={t("adminDetails.archiveShop")}
                        icon={<Archive size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="orange"
                        onClick={() => archiveShopHandler(shop?.id)}
                      />
                    ) : (
                      <IconButton
                        aria-label={t("adminDetails.restoreShop")}
                        icon={<ArchiveRestore size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => restoreShopHandler(shop?.id)}
                      />
                    )}
                    <IconButton
                      aria-label={t("adminDetails.deleteShop")}
                      icon={<Trash size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteShopId(shop.id);
                        onShopOpen();
                      }}
                    />
                  </Flex>
                </Flex>
                <Badge
                  colorScheme={shop.status === "active" ? "green" : "yellow"}
                  mt={2}
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                >
                  {shop.status}
                </Badge>
              </CardHeader>

              <CardBody>
                {shop?.logo && (
                  <Flex justify="center" mb={4}>
                    <Image
                      src={shop.logo}
                      alt={shop.name}
                      boxSize="120px"
                      objectFit="contain"
                      borderRadius="full"
                      border="2px solid"
                      borderColor={borderColor}
                    />
                  </Flex>
                )}

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.address")}
                    </Text>
                    <Text fontWeight="medium">{shop.address}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.city")}
                    </Text>
                    <Text fontWeight="medium">{shop.city}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.zipCode")}
                    </Text>
                    <Text fontWeight="medium">{shop.zipCode}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.country")}
                    </Text>
                    <Text fontWeight="medium">{shop.country}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.phone")}
                    </Text>
                    <Text fontWeight="medium">{shop.tel}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {t("adminDetails.winningPercentage")}
                    </Text>
                    <Text fontWeight="medium">{shop.winningPercentage}%</Text>
                  </Box>
                </SimpleGrid>

                <Divider my={4} />

                {/* Chosen Game */}
                {shop?.activeGameAssignments?.[0]?.game && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>
                      {t("adminDetails.chosenGame")}
                    </Heading>
                    <Flex align="center" gap={3}>
                      {shop.activeGameAssignments[0].game.pictureUrl && (
                        <Image
                          src={shop.activeGameAssignments[0].game.pictureUrl}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <Text fontWeight="medium">
                        {shop.activeGameAssignments[0].game.name}
                      </Text>
                    </Flex>
                  </Box>
                )}

                {/* Chosen Actions */}
                {shop?.chosenActions?.length > 0 && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>
                      {t("adminDetails.chosenActions")}
                    </Heading>
                    <SimpleGrid columns={2} spacing={2}>
                      {shop.chosenActions.map((action, index) => (
                        <Box key={index} p={2} borderRadius="md" bg={hoverBg}>
                          <Text fontSize="sm" fontWeight="medium">
                            {action.name}
                          </Text>
                          <Text fontSize="xs">Position: {action.position}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Rewards */}
                {shop?.rewards?.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={2}>
                      {t("adminDetails.rewards")}
                    </Heading>
                    <SimpleGrid columns={2} spacing={2}>
                      {shop.rewards.map((reward, index) => (
                        <Box key={index} p={2} borderRadius="md" bg={hoverBg}>
                          <Text fontSize="sm" fontWeight="medium">
                            {reward.name}
                          </Text>
                          <Text fontSize="xs">
                            {reward.percentage}% · {reward.nbRewardToWin}{" "}
                            available
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <DeleteAdminModal
        isOpen={isAdminOpen}
        onClose={onAdminClose}
        refetch={refetch}
      />
      <DeleteShopModal
        isOpen={isShopOpen}
        onClose={onShopClose}
        refetch={refetch}
        shopId={deleteShopId}
      />
    </Box>
  );
};

export default AdminDetails;
