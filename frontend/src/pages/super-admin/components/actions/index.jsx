import { useAxiosPrivate, useToast } from "@/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActions, deleteAction } from "@/services/actionService";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import CreateActionModal from "./CreateActionModal";

import {
  Flex,
  Button,
  Td,
  Spinner,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";

import IconButton from "@/components/common/IconButton";
import { DeleteIcon } from "@chakra-ui/icons";
const { t } = useTranslation();
const HEADERS = [
  t("actions.headers.name"),
  t("actions.headers.createdAt"),
  t("actions.headers.updatedAt"),
  t("actions.headers.isActive"),
  t("actions.headers.actions"),
];
const Actions = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const createActionHandler = () => {
    onOpen();
  };

  const { data: actions, isLoading } = useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      const response = await getActions();
      return response.data.data.actions;
    },
    onError: () => toast(t("actions.messages.fetchError"), "error"),
  });

  const deleteActionMutation = useMutation({
    mutationFn: async (data) => await deleteAction(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries("actions");
      toast(t("actions.messages.deleteSuccess"), "success");
    },
    onError: () => toast(t("actions.messages.deleteError"), "error"),
  });

  const deleteActionHandler = (id) => {
    deleteActionMutation.mutate(id);
  };

  const rows = (action) => (
    <>
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
        <Switch colorScheme="primary" size="sm" isChecked={action.isActive} />
      </Td>

      <Td>
        <Flex justify="center">
          <IconButton
            label={t("actions.buttons.delete")}
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => deleteActionHandler(action?.id)}
          />
        </Flex>
      </Td>
    </>
  );

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={createActionHandler}
          >
            {t("actions.buttons.create")}
          </Button>
        </Flex>

        <DataTable data={actions} headers={HEADERS} rows={rows} />

        {isLoading && (
          <Spinner
            thickness="4px"
            emptyColor="gray.200"
            color="primary.500"
            size="xl"
          />
        )}
      </Flex>

      <CreateActionModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Actions;
