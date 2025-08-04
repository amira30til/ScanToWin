import { useAxiosPrivate, useToast } from "@/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@chakra-ui/react";

import { getActions, deleteAction } from "@/services/actionService";

import DataTable from "@/components/DataTable";
import CreateActionModal from "./CreateActionModal";
import IconButton from "@/components/common/IconButton";

import { DateTime } from "luxon";
import { Flex, Button, Td, Tr, Spinner, Switch } from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

const HEADERS = ["Name", "Created at", "Updated at", "Is Active", "Actions"];

const Actions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: actions, isLoading } = useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      const response = await getActions();
      return response.data.data.actions;
    },
    onError: () => toast("Failed to fetch actions", "error"),
  });

  const deleteActionMutation = useMutation({
    mutationFn: async (data) => await deleteAction(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("actions");
      toast("Action deleted successfully", "success");
    },
    onError: () => toast("Failed to delete action", "error"),
  });

  const deleteActionHandler = (id) => {
    deleteActionMutation.mutate(id);
  };

  if (isLoading) return <Spinner color="secondary.500" />;

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button variant="solid" colorScheme="primary" onClick={onOpen}>
            Create an action
          </Button>
        </Flex>

        <DataTable headers={HEADERS}>
          {actions?.map((action, index) => (
            <Tr key={index} fontSize="xs">
              <Td fontWeight="bold">{action?.name}</Td>
              <Td>
                {DateTime.fromJSDate(new Date(action?.createdAt)).toFormat(
                  "dd-MM-yyyy 'à' HH:mm",
                )}
              </Td>
              <Td>
                {DateTime.fromJSDate(new Date(action?.updatedAt)).toFormat(
                  "dd-MM-yyyy 'à' HH:mm",
                )}
              </Td>
              <Td>
                <Switch
                  colorScheme="primary"
                  size="sm"
                  isChecked={action.isActive}
                />
              </Td>
              <Td>
                <Flex justify="center">
                  <IconButton
                    label="Delete action"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => deleteActionHandler(action?.id)}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Flex>

      <CreateActionModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Actions;
