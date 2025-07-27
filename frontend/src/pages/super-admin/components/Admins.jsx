import { useAxiosPrivate, useToast } from "@/hooks";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";

import { deleteAdmin, getAdmins } from "@/services/adminService";
import { DateTime } from "luxon";

import CreateAdminModal from "@/components/modals/CreateAdminModal";
import DataTable from "@/components/DataTable";
import IconButton from "@/components/common/IconButton";

import { Flex, Button, Td, Spinner } from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

const HEADERS = [
  "Email",
  "Role",
  "Status",
  "Phone",
  "Created at",
  "Updated at",
  "Actions",
];

const Admins = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await getAdmins(axiosPrivate);
      const data = response.data.data.admins.filter(
        (admin) => admin.role !== "SUPER_ADMIN",
      );
      return data;
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

  const rows = (admin) => (
    <>
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

  if (isLoading)
    return (
      <Spinner
        thickness="4px"
        emptyColor="gray.200"
        color="primary.500"
        size="xl"
      />
    );

  return <AdminsTable headers={HEADERS} data={admins} rows={rows} />;
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
      </Flex>

      <CreateAdminModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Admins;
