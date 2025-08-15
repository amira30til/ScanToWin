import { useState, useMemo } from "react";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";

import { getActions } from "@/services/actionService";

import CreateActionModal from "./CreateActionModal";
import DeleteActionModal from "./DeleteActionModal";
import IconButton from "@/components/common/IconButton";

import { DateTime } from "luxon";

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
} from "@chakra-ui/react";

import {
  Trash,
  Plus,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  Eye,
  Edit,
} from "lucide-react";

import { useTranslation } from "react-i18next";

const Actions = () => {
  const { t } = useTranslation();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [deleteActionId, setDeleteActionId] = useState();
  const toast = useToast();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Color scheme
  const cardBg = useColorModeValue("surface.card", "gray.700");
  const borderColor = useColorModeValue("surface.divider", "gray.600");

  const {
    data: actions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      const response = await getActions();
      return response.data.data.actions || [];
    },
    onError: () => toast(t("actions.messages.fetchError"), "error"),
  });

  // Filter and pagination logic
  const { paginatedData, totalItems, totalPages } = useMemo(() => {
    if (!actions) return { paginatedData: [], totalItems: 0, totalPages: 0 };

    const total = actions.length;
    const pages = Math.ceil(total / itemsPerPage);

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = actions.slice(startIndex, endIndex);

    return {
      paginatedData: paginated,
      totalItems: total,
      totalPages: pages,
    };
  }, [actions, currentPage, itemsPerPage]);

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

  const handleDeleteAction = (actionId) => {
    setDeleteActionId(actionId);
    onDeleteOpen();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={12}>
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="text.secondary">Loading actions...</Text>
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
            onClick={onCreateOpen}
            size="md"
            borderRadius="md"
            fontWeight="semibold"
          >
            {t("actions.add_button") || "Create Action"}
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
                  ACTION
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  STATUS
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  CREATED
                </Th>
                <Th
                  color="text.secondary"
                  fontWeight="semibold"
                  fontSize="xs"
                  letterSpacing="wide"
                >
                  LAST UPDATED
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
              {paginatedData.map((action, index) => (
                <Tr
                  key={action.id || index}
                  _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
                  transition="background-color 0.2s"
                >
                  {/* Action Info */}
                  <Td py={4}>
                    <HStack spacing={3}>
                      <Avatar
                        size="md"
                        name={action?.name}
                        bg="primary.500"
                        color="white"
                        fontWeight="semibold"
                        icon={<Activity size={20} />}
                      />
                      <VStack align="start" spacing={1}>
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          color="text.primary"
                        >
                          {action?.name || "Unnamed Action"}
                        </Text>
                        <Text fontSize="xs" color="text.secondary">
                          ID: {action?.id || "N/A"}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>

                  {/* Status */}
                  <Td py={4}>
                    <Badge
                      colorScheme={
                        action?.isActive !== false ? "green" : "gray"
                      }
                      variant="solid"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="semibold"
                    >
                      {action?.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </Td>

                  {/* Created Date */}
                  <Td py={4}>
                    <VStack align="start" spacing={1}>
                      <HStack spacing={2}>
                        <Icon as={Calendar} size={12} color="text.secondary" />
                        <Text fontSize="xs" color="text.secondary">
                          Created
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="text.primary">
                        {action?.createdAt
                          ? DateTime.fromJSDate(
                              new Date(action.createdAt),
                            ).toFormat("dd MMM yyyy")
                          : "N/A"}
                      </Text>
                      {action?.createdAt && (
                        <Text fontSize="xs" color="text.secondary">
                          {DateTime.fromJSDate(
                            new Date(action.createdAt),
                          ).toFormat("HH:mm")}
                        </Text>
                      )}
                    </VStack>
                  </Td>

                  {/* Updated Date */}
                  <Td py={4}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="text.primary">
                        {action?.updatedAt
                          ? DateTime.fromJSDate(
                              new Date(action.updatedAt),
                            ).toFormat("dd MMM yyyy")
                          : "N/A"}
                      </Text>
                      {action?.updatedAt && (
                        <Text fontSize="xs" color="text.secondary">
                          {DateTime.fromJSDate(
                            new Date(action.updatedAt),
                          ).toRelative()}
                        </Text>
                      )}
                    </VStack>
                  </Td>

                  {/* Actions */}
                  <Td py={4}>
                    <HStack justify="center" spacing={2}>
                      <IconButton
                        aria-label="View action"
                        icon={<Eye size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        borderRadius="md"
                        _hover={{ bg: "blue.50" }}
                      />

                      <IconButton
                        aria-label="Edit action"
                        icon={<Edit size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        borderRadius="md"
                        _hover={{ bg: "green.50" }}
                      />

                      <IconButton
                        aria-label="Delete action"
                        icon={<Trash size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="md"
                        onClick={() => handleDeleteAction(action?.id)}
                        _hover={{ bg: "red.50" }}
                      />

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
                          <MenuItem icon={<Edit size={16} />}>
                            Edit Action
                          </MenuItem>
                          <MenuItem icon={<Activity size={16} />}>
                            View Activity
                          </MenuItem>
                          <MenuItem
                            icon={<Trash size={16} />}
                            color="red.600"
                            onClick={() => handleDeleteAction(action?.id)}
                          >
                            Delete Action
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Td>
                </Tr>
              ))}
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
                <Icon as={Activity} size={24} color="text.secondary" />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="text.primary">
                  No actions found
                </Text>
                <Text fontSize="sm" color="text.secondary" maxW="400px">
                  No actions to display. Create your first action to get
                  started.
                </Text>
              </VStack>
              <Button
                colorScheme="primary"
                leftIcon={<Plus size={18} />}
                onClick={onCreateOpen}
                size="md"
                mt={4}
              >
                Create First Action
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
                  {totalItems} actions
                </Text>
                <HStack spacing={4}>
                  <HStack spacing={2}>
                    <Box w={2} h={2} bg="green.500" borderRadius="full" />
                    <Text fontSize="sm" color="text.secondary">
                      {actions?.filter((a) => a.isActive !== false).length || 0}{" "}
                      Active
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Box w={2} h={2} bg="gray.500" borderRadius="full" />
                    <Text fontSize="sm" color="text.secondary">
                      {actions?.filter((a) => a.isActive === false).length || 0}{" "}
                      Inactive
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

      {/* Modals */}
      <CreateActionModal isOpen={isCreateOpen} onClose={onCreateClose} />
      <DeleteActionModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        actionId={deleteActionId}
        refetch={refetch}
      />
    </Box>
  );
};

export default Actions;
