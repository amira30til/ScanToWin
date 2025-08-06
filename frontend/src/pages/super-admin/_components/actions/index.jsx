import { useState } from "react";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";

import { getActions } from "@/services/actionService";

import DataTable from "@/components/DataTable";
import CreateActionModal from "./CreateActionModal";
import IconButton from "@/components/common/IconButton";
import DeleteActionModal from "./DeleteActionModal";

import { DateTime } from "luxon";
import { Flex, Button, Td, Tr, Spinner } from "@chakra-ui/react";

import { Trash } from "lucide-react";
const HEADERS = ["Name", "Created at", "Updated at", "Actions"];

const Actions = () => {
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

  const {
    data: actions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      const response = await getActions();
      return response.data.data.actions;
    },
    onError: () => toast("Failed to fetch actions", "error"),
  });

  if (isLoading) return <Spinner color="secondary.500" />;

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button variant="solid" colorScheme="primary" onClick={onCreateOpen}>
            Create an action
          </Button>
        </Flex>

        <DataTable headers={HEADERS}>
          {actions?.map((action, index) => (
            <Tr key={index} fontSize="xs">
              <Td fontWeight="bold">{action?.name}</Td>
              <Td>
                {action?.createdAt &&
                  DateTime.fromJSDate(new Date(action?.createdAt)).toFormat(
                    "dd-MM-yyyy 'à' HH:mm",
                  )}
              </Td>
              <Td>
                {action?.updatedAt &&
                  DateTime.fromJSDate(new Date(action?.updatedAt)).toFormat(
                    "dd-MM-yyyy 'à' HH:mm",
                  )}
              </Td>
              <Td>
                <Flex justify="center">
                  <Flex justify="center" gap={2}>
                    {/* {action.isActive && (
                      <IconButton
                        label="archive action"
                        icon={<Archive size={20} />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => archiveActionHandler(action?.id)}
                        isLoading={archiveActionMutation.isPending}
                      />
                    )}
                    {!action.isActive && (
                      <IconButton
                        label="restore action"
                        icon={<ArchiveRestore size={20} />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => restoreActionHandler(action?.id)}
                        isLoading={restoreActionMutation.isPending}
                      />
                    )} */}
                    <IconButton
                      label="view"
                      icon={<Trash size={20} />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        onDeleteOpen();
                        setDeleteActionId(action?.id);
                      }}
                    />
                  </Flex>
                </Flex>
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Flex>

      <CreateActionModal isOpen={isCreateOpen} onClose={onCreateClose} />

      <DeleteActionModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        actionId={deleteActionId}
        refetch={refetch}
      />
    </>
  );
};

export default Actions;
