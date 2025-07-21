import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { upsertActionsValidator } from "@/validators/upsertActionsValidator";
import {
  getActionsByShop,
  getActions,
  upsertActions,
} from "@/services/actionService";

import AdminSection from "@/components/common/AdminSection";
import ActionsTable from "./ActionsTable";
import AddAction from "./AddAction";

import { Flex, Button, Text, Spinner } from "@chakra-ui/react";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";

const Actions = () => {
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: actionsByShop, isLoading: isLoadingActions } = useQuery({
    queryKey: ["actions-by-shop", shopId],
    queryFn: async () => {
      const response = await getActionsByShop(shopId);
      return response.data.data.chosenActions;
    },
    enabled: !!shopId,
  });

  const { data: actions } = useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      const response = await getActions();
      return response.data.data.actions;
    },
  });

  const onUpsertActionsSuccess = () => {
    queryClient.invalidateQueries("actions-by-shop");
    toast(SUCCESS_MESSAGES.ACTION_UPDATE_SUCCESS, "success");
  };

  const onUpsertActionsError = () => {
    toast(ERROR_MESSAGES.ACTION_UPDATE_FAILED, "error");
  };

  const upsertActionsMutation = useMutation({
    mutationFn: async (values) =>
      await upsertActions(axiosPrivate, shopId, values),
    onSuccess: onUpsertActionsSuccess,
    onError: onUpsertActionsError,
  });

  const methods = useForm({
    resolver: yupResolver(upsertActionsValidator),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "actionsByShop",
    keyName: "hook_form_id",
  });

  const onSubmit = (values) => {
    const { actionsByShop } = values;

    if (!!shopId) {
      const chosenActions = actionsByShop.map((action, index) => {
        const matched = actions.find((a) => a.name === action.name);

        return {
          ...action,
          position: index + 1,
          actionId: matched?.id,
          shopId,
        };
      });

      upsertActionsMutation.mutate({
        shopId,
        chosenActions,
      });
    }
  };

  useEffect(() => {
    if (actionsByShop?.length) {
      const sortedActions = [...actionsByShop].sort(
        (a, b) => a.position - b.position,
      );
      reset({ actionsByShop: sortedActions });
    }
  }, [actionsByShop, reset]);

  if (isLoadingActions) return <Spinner />;

  return (
    <AdminSection
      title="Choose actions"
      description="Define the order and actions your customers need to take to maximize engagement."
    >
      <FormProvider {...methods}>
        <Flex
          as="form"
          direction="column"
          gap={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          <AddAction actions={actions} append={append} />

          <ActionsTable fields={fields} move={move} remove={remove} />
          {errors.actionsByShop?.root?.message && (
            <Text color="red">{errors.actionsByShop?.root?.message}</Text>
          )}

          <Flex w="full" justify="end">
            <Button
              type="submit"
              colorScheme="primary"
              isLoading={upsertActionsMutation.isPending}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </FormProvider>
    </AdminSection>
  );
};

export default Actions;
