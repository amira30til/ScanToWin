import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks";
import { useDisclosure } from "@chakra-ui/react";

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
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Mail, Phone, Archive, ArchiveRestore, Trash } from "lucide-react";

const AdminDetails = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
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
  });

  const updateShopMutation = useMutation({
    mutationFn: async ({ shopId, values }) =>
      await updateShop(axiosPrivate, shopId, adminId, values),
    onSuccess: () => refetch(),
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

  if (isLoading) return <Spinner colorScheme="secondary" />;

  return (
    <>
      <Flex justify="center">
        <Flex direction="column" w="100%" justify="start" p={8}>
          <Flex>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="link"
              colorScheme="secondary"
              onClick={() => navigate("/super-admin")}
            >
              go back
            </Button>
          </Flex>
          <Flex direction="column" gap={4} my={6}>
            <Heading size="lg" fontWeight="semibold" my={6}>
              Admin Details
            </Heading>
            <Flex align="center" gap={4}>
              <Flex align="center" gap={2}>
                <Mail size={16} />
                <Heading size="md" fontWeight="semibold">
                  {admin?.email}
                </Heading>
              </Flex>

              <Badge
                display="flex"
                align="center"
                gap={1}
                colorScheme="secondary"
              >
                <Phone size={16} />
                {admin?.tel}
              </Badge>

              <Badge
                colorScheme={
                  admin?.adminStatus === "ACTIVE"
                    ? "green"
                    : admin?.adminStatus === "ARCHIVED"
                      ? "yellow"
                      : ""
                }
              >
                {admin?.adminStatus}
              </Badge>
              <IconButton
                label="delete admin"
                icon={<Trash size={20} />}
                size="sm"
                colorScheme="red"
                onClick={onAdminOpen}
              />
            </Flex>
            <Flex>
              <Text fontWeight="semibold" color="gray.600" me={2}>
                Password verification Code:{" "}
              </Text>
              <Text>2455{admin?.verificationCode}</Text>
            </Flex>

            <Flex>
              <Text fontWeight="semibold" color="gray.600" me={2}>
                Created at:{" "}
              </Text>

              <Text>
                {admin?.createdAt &&
                  format(parseISO(admin?.createdAt), "MMMM d, yyyy à hh'h'mm", {
                    locale: fr,
                  })}
              </Text>
            </Flex>

            <Flex>
              <Text fontWeight="semibold" color="gray.600" me={2}>
                Last updated at:{" "}
              </Text>
              <Text>
                {admin?.updatedAt &&
                  format(parseISO(admin?.updatedAt), "MMMM d, yyyy à hh'h'mm", {
                    locale: fr,
                  })}
              </Text>
            </Flex>
          </Flex>
          <Heading size="lg" fontWeight="semibold" my={10}>
            Shops
          </Heading>
          {admin?.shops?.length < 1 && (
            <Text>This admin don't have a shop yet</Text>
          )}
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            bg="surface.popover"
            direction={{ base: "column", lg: "row" }}
            gap={8}
            p={10}
          >
            {admin?.shops?.map((shop, index) => (
              <Flex direction="column" gap={4} key={index}>
                <Flex gap={6} align="center">
                  <Flex gap={2} align="center">
                    <Heading size="sm">{shop?.name}</Heading>
                    <Badge
                      colorScheme={
                        shop.status === "active"
                          ? "green"
                          : shop.status === "archived"
                            ? "yellow"
                            : ""
                      }
                    >
                      {shop.status}
                    </Badge>
                  </Flex>

                  <Flex justify="center" gap={2}>
                    {shop.status === "active" && (
                      <IconButton
                        label="archive shop"
                        icon={<Archive size={20} />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => archiveShopHandler(shop?.id)}
                      />
                    )}

                    {shop.status === "archived" && (
                      <IconButton
                        label="restore shop"
                        icon={<ArchiveRestore size={20} />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => restoreShopHandler(shop?.id)}
                      />
                    )}

                    <IconButton
                      label="delete shop"
                      icon={<Trash size={20} />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteShopId(shop.id);
                        onShopOpen();
                      }}
                    />
                  </Flex>
                </Flex>

                {shop?.logo && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={4}
                  >
                    <Image
                      src={shop.logo}
                      alt={shop.name}
                      boxSize="280px"
                      objectFit="cover"
                      borderRadius="full"
                      boxShadow="lg"
                      border="2px solid"
                      borderColor="gray.200"
                    />
                  </Box>
                )}
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Address:{" "}
                  </Text>
                  <Text>{shop.address}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    city:{" "}
                  </Text>
                  <Text>{shop.city}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    ZIP Code:{" "}
                  </Text>
                  <Text>{shop.zipCode}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    country:{" "}
                  </Text>
                  <Text>{shop.country}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    shop PIN code:{" "}
                  </Text>
                  <Text>{shop.shopCodePin}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Primary color:{" "}
                  </Text>
                  <Text>{shop.shopColor1}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Secondary color:{" "}
                  </Text>
                  <Text>{shop.shopColor2}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Is Guaranteed Win:{" "}
                  </Text>
                  <Text>
                    {shop.isGuaranteedWin === true ? "true" : "false"}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Nomber Siret:{" "}
                  </Text>
                  <Text>{shop.nbSiret}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Phone:{" "}
                  </Text>
                  <Text>{shop.tel}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    Winning Percentage :{" "}
                  </Text>
                  <Text>{shop.winningPercentage}%</Text>
                </Flex>

                <Heading size="md">Chosen Actions</Heading>
                <SimpleGrid
                  columns={{ sm: 1, md: 2 }}
                  bg="surface.popover"
                  gap={8}
                >
                  {shop?.chosenActions?.map((action, index) => (
                    <Box key={index}>
                      <Text fontWeight="semibold">{action?.name}</Text>
                      <Text fontSize="sm">Position: {action?.position}</Text>
                      <Text fontSize="sm">
                        Target Link: {action?.targetLink}
                      </Text>
                      <Text fontSize="sm">
                        Redeemed rewards: {action?.redeemedRewards}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
                <Heading size="md">Chosen game</Heading>
                <Box>
                  <Flex direction="column" align="start" gap={2}>
                    <Text fontWeight="semibold">
                      {shop?.activeGameAssignments[0]?.game?.name}
                    </Text>

                    {shop?.activeGameAssignments?.[0]?.game?.pictureUrl && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={4}
                      >
                        <Image
                          src={shop?.activeGameAssignments[0]?.game?.pictureUrl}
                          boxSize="280px"
                          objectFit="cover"
                          borderRadius="full"
                          boxShadow="lg"
                          border="2px solid"
                          borderColor="gray.200"
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>

                <Heading size="md">Rewards</Heading>
                <SimpleGrid
                  columns={{ sm: 1, md: 2 }}
                  bg="surface.popover"
                  gap={8}
                >
                  {shop?.rewards?.map((reward, index) => (
                    <Box key={index}>
                      <Text fontWeight="semibold">{reward?.name}</Text>
                      <Text fontSize="sm">
                        Number of rewards to win : {reward?.nbRewardToWin}
                      </Text>
                      <Text fontSize="sm">
                        Percentage: {reward?.percentage}%
                      </Text>
                      <Text fontSize="sm">
                        Is unlimited:{" "}
                        {reward?.isUnlimited === true ? "true" : "false"}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Flex>
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>

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
    </>
  );
};

export default AdminDetails;
