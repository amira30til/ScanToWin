// HOOKS
import { useAxiosPrivate, useLogout, useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// FUNCTIONS
import { getAdmins, deleteAdmin } from "@/services/adminService";
import { DateTime } from "luxon";

// COMPONENTS
import CreateAdminModal from "@/components/modals/CreateAdminModal";
import DataTable from "@/components/DataTable";
import Logo from "@/components/Logo";
import SuperAdminGames from "./SuperAdminGames";

// STYLES
import {
  Flex,
  Box,
  Button,
  Spinner,
  Heading,
  Td,
  useDisclosure,
} from "@chakra-ui/react";
import IconButton from "@/components/common/IconButton";

// ASSETS
import { DeleteIcon } from "@chakra-ui/icons";

const SuperAdminHome = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await getAdmins(axiosPrivate);
      return response.data.data.admins;
    },
    onError: () => toast("Failed to fetch admins", "error"),
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (data) => await deleteAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      toast("Admin deleted successfully", "success");
    },
    onError: () => toast("Failed to delete admin", "error"),
  });

  const deleteAdminHandler = (id) => {
    deleteAdminMutation.mutate(id);
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const headers = [
    "Name",
    "Email",
    "Role",
    "Status",
    "Phone",
    "Created at",
    "Updated at",
    "Actions",
  ];

  const rows = (admin) => (
    <>
      <Td fontWeight="bold">
        {admin?.firstName} {admin?.lastName}
      </Td>
      <Td>{admin?.email}</Td>
      <Td>{admin?.role}</Td>
      <Td>{admin?.adminStatus}</Td>
      <Td>{admin?.tel}</Td>
      <Td>
        {DateTime.fromJSDate(new Date(admin?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </Td>
      <Td>
        {DateTime.fromJSDate(new Date(admin?.updatedAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </Td>
      <Td>
        <Flex justify="center">
          <IconButton
            label="Delete admin"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => deleteAdminHandler(admin?.id)}
          />
        </Flex>
      </Td>
    </>
  );

  return (
    <Box w="100%">
      <Flex
        justify="space-between"
        align="center"
        w="100%"
        py={2}
        px={4}
        bg="surface.navigation"
        shadow="md"
      >
        <Logo h="60px" w="unset" objectFit="unset" />

        <Button
          colorScheme="primary"
          variant="outline"
          type="button"
          size="sm"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Flex>

      <Box p={4} py={8}>
        <Heading size="lg">Super Admin Home</Heading>

        <Flex direction="column" py={8}>
          <Heading size="md">Admins List</Heading>

          <Box py={8}>
            <AdminsTable headers={headers} data={admins} rows={rows} />

            {isLoading && (
              <Spinner
                thickness="4px"
                emptyColor="gray.200"
                color="primary.500"
                size="xl"
              />
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

const AdminsTable = ({ data, headers, rows }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const createAdminHandler = () => {
    onOpen();
  };
  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={createAdminHandler}
          >
            Create an admin
          </Button>
        </Flex>

        <DataTable data={data} headers={headers} rows={rows} />

        <SuperAdminGames />
      </Flex>

      <CreateAdminModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default SuperAdminHome;
