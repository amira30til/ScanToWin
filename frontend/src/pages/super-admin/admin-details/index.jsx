import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks";
import { useDisclosure } from "@chakra-ui/react";
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
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Mail, Phone, Archive, ArchiveRestore, Trash } from "lucide-react";

const AdminDetails = () => {
  const { t } = useTranslation();
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
              {t("adminDetails.goBack")}
            </Button>
          </Flex>
          <Flex direction="column" gap={4} my={6}>
            <Heading size="lg" fontWeight="semibold" my={6}>
              {t("adminDetails.title")}
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
                label={t("adminDetails.deleteAdmin")}
                icon={<Trash size={20} />}
                size="sm"
                colorScheme="red"
                onClick={onAdminOpen}
              />
            </Flex>
            <Flex>
              <Text fontWeight="semibold" color="gray.600" me={2}>
                {t("adminDetails.passwordVerificationCode")}:
              </Text>
              <Text>2455{admin?.verificationCode}</Text>
            </Flex>

            <Flex>
              <Text fontWeight="semibold" color="gray.600" me={2}>
                {t("adminDetails.createdAt")}:
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
                {t("adminDetails.lastUpdatedAt")}:
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
            {t("adminDetails.shops")}
          </Heading>
          {admin?.shops?.length < 1 && (
            <Text>{t("adminDetails.noShopsYet")}</Text>
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
                        label={t("adminDetails.archiveShop")}
                        icon={<Archive size={20} />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => archiveShopHandler(shop?.id)}
                      />
                    )}

                    {shop.status === "archived" && (
                      <IconButton
                        label={t("adminDetails.restoreShop")}
                        icon={<ArchiveRestore size={20} />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => restoreShopHandler(shop?.id)}
                      />
                    )}

                    <IconButton
                      label={t("adminDetails.deleteShop")}
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
                    {t("adminDetails.address")}:
                  </Text>
                  <Text>{shop.address}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.city")}:
                  </Text>
                  <Text>{shop.city}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.zipCode")}:
                  </Text>
                  <Text>{shop.zipCode}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.country")}:
                  </Text>
                  <Text>{shop.country}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.shopPinCode")}:
                  </Text>
                  <Text>{shop.shopCodePin}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.primaryColor")}:
                  </Text>
                  <Text>{shop.shopColor1}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.secondaryColor")}:{" "}
                  </Text>
                  <Text>{shop.shopColor2}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.isGuaranteedWin")}:
                  </Text>
                  <Text>
                    {shop.isGuaranteedWin === true ? "true" : "false"}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.numberSiret")}:{" "}
                  </Text>
                  <Text>{shop.nbSiret}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.phone")}:{" "}
                  </Text>
                  <Text>{shop.tel}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="semibold" color="gray.600" me={2}>
                    {t("adminDetails.winningPercentage")}:{" "}
                  </Text>
                  <Text>{shop.winningPercentage}%</Text>
                </Flex>

                <Heading size="md">{t("adminDetails.chosenActions")}</Heading>
                <SimpleGrid
                  columns={{ sm: 1, md: 2 }}
                  bg="surface.popover"
                  gap={8}
                >
                  {shop?.chosenActions?.map((action, index) => (
                    <Box key={index}>
                      <Text fontWeight="semibold">{action?.name}</Text>
                      <Text fontSize="sm">
                        {t("adminDetails.position")}: {action?.position}
                      </Text>
                      <Text fontSize="sm">
                        {t("adminDetails.targetLink")}: {action?.targetLink}
                      </Text>
                      <Text fontSize="sm">
                        {t("adminDetails.redeemedRewards")}:{" "}
                        {action?.redeemedRewards}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
                <Heading size="md">{t("adminDetails.chosenGame")}</Heading>
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

                <Heading size="md">{t("adminDetails.rewards")}</Heading>
                <SimpleGrid
                  columns={{ sm: 1, md: 2 }}
                  bg="surface.popover"
                  gap={8}
                >
                  {shop?.rewards?.map((reward, index) => (
                    <Box key={index}>
                      <Text fontWeight="semibold">{reward?.name}</Text>
                      <Text fontSize="sm">
                        {t("adminDetails.numberOfRewardsToWin")}:{" "}
                        {reward?.nbRewardToWin}
                      </Text>
                      <Text fontSize="sm">
                        {t("adminDetails.percentage")}: {reward?.percentage}%
                      </Text>
                      <Text fontSize="sm">
                        {t("adminDetails.isUnlimited")}:
                        {reward?.isUnlimited === true
                          ? t("adminDetails.true")
                          : t("adminDetails.false")}
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
