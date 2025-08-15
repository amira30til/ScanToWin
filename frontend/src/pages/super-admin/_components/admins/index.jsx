import { useState, useMemo } from "react";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { archiveAdmin, getAdmins, restoreAdmin } from "@/services/adminService";
import { DateTime } from "luxon";

import CreateAdminModal from "./CreateAdminModal";
import IconButton from "@/components/common/IconButton";

import {
  Flex,
  Button,
  Td,
  Tr,
  Spinner,
  Badge,
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Th,
  TableContainer,
  Select,
  ButtonGroup,
  AlertIcon,
} from "@chakra-ui/react";

import {
  Archive,
  Check,
  ArchiveRestore,
  Eye,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { useTranslation } from "react-i18next";

const Admins = () => {
  const { t } = useTranslation();

  const STATUS_MAP = {
    ACTIVE: {
      statusColor: "green",
      statusText: t("admins.table.headers.statuss.active") || "Active",
    },
    ARCHIVED: {
      statusColor: "yellow",
      statusText: t("admins.table.headers.statuss.archived") || "Archived",
    },
  };

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showArchived, setShowArchived] = useState(true);

  // Color scheme
  const cardBg = useColorModeValue("surface.card", "gray.700");
  const borderColor = useColorModeValue("surface.divider", "gray.600");

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await getAdmins(axiosPrivate);
      const data = response.data.data.admins
        .filter((admin) => admin.role !== "SUPER_ADMIN")
        .sort((a, b) =>
          a.adminStatus === "ACTIVE" ? -1 : b.adminStatus === "ACTIVE" ? 1 : 0,
        );
      return data;
    },
    onError: () => toast(t("admins.table.messages.fetchFailed"), "error"),
  });

  const archiveAdminMutation = useMutation({
    mutationFn: async (data) => await archiveAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      toast(
        t("admins.table.messages.archiveSuccess") ||
          "Admin archived successfully",
        "success",
      );
    },
    onError: () =>
      toast(
        t("admins.table.messages.archiveFailed") || "Failed to archive admin",
        "error",
      ),
  });

  const restoreAdminMutation = useMutation({
    mutationFn: async (data) => await restoreAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      toast(
        t("admins.table.messages.restoreSuccess") ||
          "Admin restored successfully",
        "success",
      );
    },
    onError: () =>
      toast(
        t("admins.table.messages.restoreFailed") || "Failed to restore admin",
        "error",
      ),
  });

  const archiveAdminHandler = (id) => {
    if (!!id) {
      archiveAdminMutation.mutate(id);
    }
  };

  const restoreAdminHandler = (id) => {
    if (!!id) {
      restoreAdminMutation.mutate(id);
    }
  };

  const showArchivedHandler = () => {
    setShowArchived((prev) => !prev);
    setCurrentPage(1); // Reset to first page when toggling
  };

  // Filter and pagination logic
  const { paginatedData, totalItems, totalPages } = useMemo(() => {
    if (!admins) return { paginatedData: [], totalItems: 0, totalPages: 0 };

    // Filter admins based on archive status
    const filteredAdmins = admins.filter(
      (admin) => showArchived || admin.adminStatus !== "ARCHIVED",
    );

    const total = filteredAdmins.length;
    const pages = Math.ceil(total / itemsPerPage);

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredAdmins.slice(startIndex, endIndex);

    return {
      paginatedData: paginated,
      totalItems: total,
      totalPages: pages,
    };
  }, [admins, showArchived, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={12}>
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="text.secondary">Loading administrators...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Header Actions */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
        p={6}
        bg={cardBg}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <HStack flex={1} spacing={4}>
          <Button
            colorScheme="primary"
            leftIcon={<Plus size={18} />}
            onClick={onOpen}
            size="md"
            borderRadius="md"
            fontWeight="semibold"
          >
            {t("admins.table.button") || "Create Admin"}
          </Button>

          <Button
            variant="outline"
            colorScheme="primary"
            leftIcon={
              showArchived ? <Check size={18} /> : <Archive size={18} />
            }
            onClick={showArchivedHandler}
            size="md"
            borderRadius="md"
          >
            {showArchived ? "Hide Archived" : "Show Archived"}
          </Button>
        </HStack>

        {/* Items per page selector */}
        <HStack spacing={3}>
          <Text fontSize="sm" color="text.secondary" whiteSpace="nowrap">
            Items per page:
          </Text>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            w="70px"
            borderRadius="md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </HStack>
      </Flex>

      {/* Modern Table */}
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="card"
        overflow="hidden"
      >
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue("gray.50", "gray.800")}>
              <Tr>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  ADMINISTRATOR
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  ROLE & STATUS
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  CONTACT
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  DATES
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                  textAlign="center"
                >
                  ACTIONS
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((admin, index) => {
                const { statusColor, statusText } =
                  STATUS_MAP[admin?.adminStatus] || {};

                return (
                  <Tr
                    key={admin.id || index}
                    _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
                    transition="background-color 0.2s"
                  >
                    {/* Administrator Info */}
                    <Td py={4}>
                      <HStack spacing={3}>
                        <Avatar
                          size="md"
                          name={admin?.email}
                          bg="primary.500"
                          color="white"
                          fontWeight="semibold"
                        />
                        <VStack align="start" spacing={1}>
                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            color="text.primary"
                          >
                            {admin?.email?.split("@")[0] || "Unknown"}
                          </Text>
                          <HStack spacing={2}>
                            <Icon as={Mail} size={12} color="text.secondary" />
                            <Text fontSize="xs" color="text.secondary">
                              {admin?.email}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Td>

                    {/* Role & Status */}
                    <Td py={4}>
                      <VStack align="start" spacing={2}>
                        <Badge
                          colorScheme="purple"
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="semibold"
                        >
                          {admin?.role}
                        </Badge>
                        <Badge
                          colorScheme={statusColor}
                          variant="solid"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="semibold"
                        >
                          {statusText}
                        </Badge>
                      </VStack>
                    </Td>

                    {/* Contact */}
                    <Td py={4}>
                      {admin?.tel ? (
                        <HStack spacing={2}>
                          <Icon as={Phone} size={14} color="text.secondary" />
                          <Text fontSize="sm" color="text.primary">
                            {admin.tel}
                          </Text>
                        </HStack>
                      ) : (
                        <Text fontSize="sm" color="text.disabled">
                          No phone
                        </Text>
                      )}
                    </Td>

                    {/* Dates */}
                    <Td py={4}>
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Icon
                            as={Calendar}
                            size={12}
                            color="text.secondary"
                          />
                          <Text fontSize="xs" color="text.secondary">
                            Created
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="text.primary">
                          {admin?.createdAt &&
                            DateTime.fromJSDate(
                              new Date(admin?.createdAt),
                            ).toFormat("dd MMM yyyy")}
                        </Text>
                        {admin?.updatedAt && (
                          <Text fontSize="xs" color="text.secondary">
                            Updated{" "}
                            {DateTime.fromJSDate(
                              new Date(admin?.updatedAt),
                            ).toRelative()}
                          </Text>
                        )}
                      </VStack>
                    </Td>

                    {/* Actions */}
                    <Td py={4}>
                      <HStack justify="center" spacing={2}>
                        <IconButton
                          aria-label={t("admins.action.view") || "View admin"}
                          icon={<Eye size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          borderRadius="md"
                          onClick={() => navigate(`/super-admin/${admin?.id}`)}
                          _hover={{ bg: "blue.50" }}
                        />

                        {admin.adminStatus === "ACTIVE" ? (
                          <IconButton
                            aria-label={
                              t("admins.action.archive") || "Archive admin"
                            }
                            icon={<Archive size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="orange"
                            borderRadius="md"
                            onClick={() => archiveAdminHandler(admin?.id)}
                            isLoading={archiveAdminMutation.isPending}
                            _hover={{ bg: "orange.50" }}
                          />
                        ) : (
                          <IconButton
                            aria-label={
                              t("admins.action.restore") || "Restore admin"
                            }
                            icon={<ArchiveRestore size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                            borderRadius="md"
                            onClick={() => restoreAdminHandler(admin?.id)}
                            isLoading={restoreAdminMutation.isPending}
                            _hover={{ bg: "green.50" }}
                          />
                        )}

                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={<MoreVertical size={16} />}
                            size="sm"
                            variant="ghost"
                            borderRadius="md"
                            _hover={{ bg: "gray.50" }}
                          />
                          <MenuList>
                            <MenuItem icon={<Eye size={16} />}>
                              View Details
                            </MenuItem>
                            <MenuItem icon={<Mail size={16} />}>
                              Send Message
                            </MenuItem>
                            {admin.adminStatus === "ACTIVE" ? (
                              <MenuItem
                                icon={<Archive size={16} />}
                                color="orange.600"
                                onClick={() => archiveAdminHandler(admin?.id)}
                              >
                                Archive Admin
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<ArchiveRestore size={16} />}
                                color="green.600"
                                onClick={() => restoreAdminHandler(admin?.id)}
                              >
                                Restore Admin
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Empty State */}
        {paginatedData.length === 0 && totalItems === 0 && (
          <Box p={12} textAlign="center">
            <VStack spacing={4}>
              <Box
                p={4}
                borderRadius="full"
                bg={useColorModeValue("gray.100", "gray.700")}
              >
                <Icon as={Plus} size={24} color="text.secondary" />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="text.primary">
                  No administrators found
                </Text>
                <Text fontSize="sm" color="text.secondary" maxW="400px">
                  No administrators to display. Create your first admin to get
                  started.
                </Text>
              </VStack>
              <Button
                colorScheme="primary"
                leftIcon={<Plus size={18} />}
                onClick={onOpen}
                size="md"
                mt={4}
              >
                Create First Admin
              </Button>
            </VStack>
          </Box>
        )}

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <Box
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
              gap={4}
            >
              {/* Stats */}
              <VStack align={{ base: "center", md: "start" }} spacing={1}>
                <Text fontSize="sm" color="text.secondary">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} administrators
                </Text>
                <HStack spacing={4}>
                  <HStack spacing={2}>
                    <Box w={2} h={2} bg="green.500" borderRadius="full" />
                    <Text fontSize="sm" color="text.secondary">
                      {admins?.filter((a) => a.adminStatus === "ACTIVE")
                        .length || 0}{" "}
                      Active
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Box w={2} h={2} bg="yellow.500" borderRadius="full" />
                    <Text fontSize="sm" color="text.secondary">
                      {admins?.filter((a) => a.adminStatus === "ARCHIVED")
                        .length || 0}{" "}
                      Archived
                    </Text>
                  </HStack>
                </HStack>
              </VStack>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <HStack spacing={2}>
                  {/* First page button */}
                  <IconButton
                    aria-label="First page"
                    icon={<ChevronsLeft size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={handleFirst}
                    isDisabled={currentPage === 1}
                  />

                  {/* Previous page button */}
                  <IconButton
                    aria-label="Previous page"
                    icon={<ChevronLeft size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={handlePrevious}
                    isDisabled={currentPage === 1}
                  />

                  {/* Page numbers */}
                  <ButtonGroup spacing={1}>
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={currentPage === pageNum ? "solid" : "ghost"}
                        colorScheme={
                          currentPage === pageNum ? "primary" : "gray"
                        }
                        onClick={() => handlePageChange(pageNum)}
                        minW="32px"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </ButtonGroup>

                  {/* Next page button */}
                  <IconButton
                    aria-label="Next page"
                    icon={<ChevronRight size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={handleNext}
                    isDisabled={currentPage === totalPages}
                  />

                  {/* Last page button */}
                  <IconButton
                    aria-label="Last page"
                    icon={<ChevronsRight size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={handleLast}
                    isDisabled={currentPage === totalPages}
                  />
                </HStack>
              )}
            </Flex>
          </Box>
        )}
      </Card>

      <CreateAdminModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Admins;
