import { useState } from "react";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { archiveAdmin, getAdmins } from "@/services/adminService";
import { DateTime } from "luxon";

import CreateAdminModal from "./CreateAdminModal";
import DataTable from "@/components/DataTable";
import IconButton from "@/components/common/IconButton";

import { Flex, Button, Td, Tr, Spinner, Badge } from "@chakra-ui/react";

import { Archive, Check, ArchiveRestore, Eye } from "lucide-react";

const HEADERS = [
  "Email",
  "Role",
  "Status",
  "Phone",
  "Created at",
  "Updated at",
  "Actions",
];

const STATUS_MAP = {
  ACTIVE: { statusColor: "green", statusText: "Active" },
  ARCHIVED: { statusColor: "yellow", statusText: "Archived" },
};

const Admins = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showArchived, setShowArchived] = useState(true);

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
    onError: () => toast("Failed to fetch admins", "error"),
  });

  const archiveAdminMutation = useMutation({
    mutationFn: async (data) => await archiveAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      toast("Admin archived successfully", "success");
    },
    onError: () => toast("Failed to archive admin", "error"),
  });

  const archiveAdminHandler = (id) => {
    archiveAdminMutation.mutate(id);
  };

  const showArchivedHandler = () => {
    setShowArchived((prev) => !prev);
  };

  if (isLoading) return <Spinner color="secondary.500" />;

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex gap={4}>
          <Button colorScheme="primary" onClick={onOpen}>
            Create an admin
          </Button>
          <Button
            variant="outline"
            colorScheme="primary"
            rightIcon={showArchived ? <Check size={18} /> : undefined}
            onClick={showArchivedHandler}
          >
            Show Archived
          </Button>
        </Flex>

        <DataTable headers={HEADERS}>
          {admins
            .filter((admin) => showArchived || admin.adminStatus !== "ARCHIVED")
            .map((admin, index) => {
              const { statusColor, statusText } =
                STATUS_MAP[admin?.adminStatus];

              return (
                <Tr key={index} fontSize="sm">
                  <Td>{admin?.email}</Td>
                  <Td>{admin?.role}</Td>
                  <Td>
                    <Badge colorScheme={statusColor}>{statusText}</Badge>
                  </Td>
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
                    <Flex justify="center" gap={2}>
                      <IconButton
                        label="view"
                        icon={<Eye size={20} />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/super-admin/${admin?.id}`)}
                      />
                      {admin.adminStatus === "ACTIVE" && (
                        <IconButton
                          label="archive admin"
                          icon={<Archive size={20} />}
                          size="sm"
                          colorScheme="yellow"
                          onClick={() => archiveAdminHandler(admin?.id)}
                        />
                      )}

                      {admin.adminStatus === "ARCHIVED" && (
                        <IconButton
                          label="restore admin"
                          icon={<ArchiveRestore size={20} />}
                          size="sm"
                          colorScheme="green"
                          // onClick={() => archiveAdminHandler(admin?.id)}
                        />
                      )}
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
        </DataTable>
      </Flex>

      <CreateAdminModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Admins;
