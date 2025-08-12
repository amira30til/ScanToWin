import { useState } from "react";
import { useAxiosPrivate, useToast } from "@/hooks";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { archiveAdmin, getAdmins, restoreAdmin } from "@/services/adminService";
import { DateTime } from "luxon";

import CreateAdminModal from "./CreateAdminModal";
import DataTable from "@/components/DataTable";
import IconButton from "@/components/common/IconButton";

import { Flex, Button, Td, Tr, Spinner, Badge } from "@chakra-ui/react";

import { Archive, Check, ArchiveRestore, Eye } from "lucide-react";

import { useTranslation } from "react-i18next";

const Admins = () => {
  const { t } = useTranslation();

  const STATUS_MAP = {
    ACTIVE: {
      statusColor: "green",
      statusText:
        t("admins.table.headers.statuss.active") || t("admins.statuss.active"),
    },
    ARCHIVED: {
      statusColor: "yellow",
      statusText:
        t("admins.table.headers.statuss.archived") ||
        t("admins.statuss.archived"),
    },
  };

  const HEADERS = [
    t("admins.table.headers.email"),
    t("admins.table.headers.role"),
    t("admins.table.headers.statuss"),
    t("admins.table.headers.phone"),
    t("admins.table.headers.createdAt"),
    t("admins.table.headers.updatedAt"),
    t("admins.table.headers.action"),
  ];

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
    onError: () => toast(t("admins.table.messages.fetchFailed"), "error"),
  });

  const archiveAdminMutation = useMutation({
    mutationFn: async (data) => await archiveAdmin(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      toast(
        t("admins.table.messages.archiveSuccess") ||
          t("success.ADMIN_CREATE_SUCCESS") ||
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

  const archiveAdminHandler = (id) => {
    if (!!id) {
      archiveAdminMutation.mutate(id);
    }
  };

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

  const restoreAdminHandler = (id) => {
    if (!!id) {
      restoreAdminMutation.mutate(id);
    }
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
            {t("admins.table.button") || "Create an admin"}
          </Button>
          <Button
            variant="outline"
            colorScheme="primary"
            rightIcon={showArchived ? <Check size={18} /> : undefined}
            onClick={showArchivedHandler}
          >
            {t("admins.table.showArchived") || "Show Archived"}
          </Button>
        </Flex>

        <DataTable headers={HEADERS}>
          {admins
            .filter((admin) => showArchived || admin.adminStatus !== "ARCHIVED")
            .map((admin, index) => {
              const { statusColor, statusText } =
                STATUS_MAP[admin?.adminStatus] || {};

              return (
                <Tr key={index} fontSize="sm">
                  <Td fontWeight="semibold">{admin?.email}</Td>
                  <Td>{admin?.role}</Td>
                  <Td>
                    <Badge colorScheme={statusColor}>{statusText}</Badge>
                  </Td>
                  <Td>{admin?.tel}</Td>
                  <Td>
                    {admin?.createdAt &&
                      DateTime.fromJSDate(new Date(admin?.createdAt)).toFormat(
                        "dd-MM-yyyy 'à' HH:mm",
                      )}
                  </Td>
                  <Td>
                    {admin?.updatedAt &&
                      DateTime.fromJSDate(new Date(admin?.updatedAt)).toFormat(
                        "dd-MM-yyyy 'à' HH:mm",
                      )}
                  </Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <IconButton
                        label={t("admins.action.view") || "view"}
                        icon={<Eye size={20} />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/super-admin/${admin?.id}`)}
                      />
                      {admin.adminStatus === "ACTIVE" && (
                        <IconButton
                          label={t("admins.action.archive") || "archive admin"}
                          icon={<Archive size={20} />}
                          size="sm"
                          colorScheme="yellow"
                          onClick={() => archiveAdminHandler(admin?.id)}
                          isLoading={archiveAdminMutation.isPending}
                        />
                      )}
                      {admin.adminStatus === "ARCHIVED" && (
                        <IconButton
                          label={t("admins.action.restore") || "restore admin"}
                          icon={<ArchiveRestore size={20} />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => restoreAdminHandler(admin?.id)}
                          isLoading={restoreAdminMutation.isPending}
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
