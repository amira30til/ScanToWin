import { upsertActionsValidator } from "@/validators/upsertActionsValidator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/react";

// COMPONENTS
import IconButton from "@/components/common/IconButton";
import DataTable from "@/components/DataTable";
import AdminSection from "@/components/common/AdminSection";

// STYLE
import {
  Flex,
  Button,
  Td,
  Link,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Table,
  FormErrorMessage,
  Editable,
  EditablePreview,
  EditableInput,
  FormControl,
  Box,
  Text,
  Switch,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

import {
  FaFacebook,
  FaTiktok,
  FaGoogle,
  FaLock,
  FaQrcode,
} from "react-icons/fa";

// ASSETS
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import FacebookSvg from "@/assets/icons/facebook.svg";
import GoogleSvg from "@/assets/icons/google.svg";
import TiktokSvg from "@/assets/icons/tiktok.svg";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
// eslint-disable-next-line import/no-unresolved
import { DynamicIcon } from "lucide-react/dynamic";

const ACTIONS = [
  {
    position: 1,
    name: "Google",
    icon: "google",
    targetLink: "https://www.google.com/maps",
  },
  {
    position: 2,
    name: "Facebook",
    icon: "facebook",
    targetLink: "https://www.google.com/maps",
  },
  {
    position: 3,
    name: "Tiktok",
    icon: "tiktok",
    targetLink: "https://www.google.com/maps",
  },
];
const HEADERS = ["Order", "Action", "link", "actions"];

const iconMap = {
  facebook: FaFacebook,
  tiktok: FaTiktok,
  google: FaGoogle,
};

const Actions = () => {
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  //   const { data: actions, isLoading: isLoadingActions } = useQuery({
  //     queryKey: ["actions-by-shop"],
  //     queryFn: async () => {
  //       const response = await getActionsByShop(shopId);
  //       return response.data.data.actions;
  //     },
  //     enabled: !!shopId,
  //   });

  //   const onUpsertActionsSuccess = () => {
  //     queryClient.invalidateQueries("actions-by-shop");
  //     toast(SUCCESS_MESSAGES.ACTION_UPDATE_SUCCESS, "success");
  //   };

  //   const onUpsertActionsError = () => {
  //     toast(ERROR_MESSAGES.ACTION_UPDATE_FAILED, "error");
  //   };

  //   const upsertActionsMutation = useMutation({
  //     mutationFn: async (values) => await upsertActions(axiosPrivate, values),
  //     onSuccess: onUpsertActionsSuccess,
  //     onError: onUpsertActionsError,
  //   });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(upsertActionsValidator),
  });
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "actions",
    keyName: "hook_form_id",
  });
  const watchedActions = watch("actions");
  const controlledActions = fields.map((field, index) => {
    return {
      ...field,
      ...watchedActions[index],
    };
  });

  const onSubmit = (values) => {
    const { actions } = values;
    // if (!!shopId) {
    //   upsertActionsMutation.mutate({
    //     shopId,
    //     actions,
    //   });
    // }

    console.log({
      shopId,
      actions,
    });
  };

  const reorderAndSetPositions = (from, to) => {
    move(from, to);
    setTimeout(() => {
      const currentActions = getValues("actions");
      currentActions.forEach((field, i) => {
        update(i, {
          ...field,
          position: i + 1,
        });
      });
    }, 200);
  };

  useEffect(() => {
    // if (actions?.length) {
    reset({ actions: ACTIONS });
    // }
  }, [
    // actions,
    reset,
  ]);

  // if (isLoadingActions) return <Spinner />;

  return (
    <AdminSection
      as="form"
      title="Choose actions"
      description="Define the order and actions your customers need to take to maximize engagement."
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex direction="column" gap={4}>
        <Flex>
          <Button
            leftIcon={<AddIcon />}
            variant="solid"
            colorScheme="secondary"
            size="sm"
            onClick={() => {
              append({
                name: "",
              });
            }}
          >
            Add a action
          </Button>
        </Flex>

        <TableContainer
          border="1px"
          borderColor="gray.300"
          minHeight="350px"
          bg="surface.navigation"
          fontSize="xs"
        >
          <Table variant="simple">
            <Thead bg="primary.100">
              <Tr>
                {HEADERS?.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {controlledActions.map((field, index) => {
                const IconComponent = iconMap[field.icon] || AddIcon;
                return (
                  <Tr key={field.hook_form_id} fontSize="xs">
                    <>
                      <Td>
                        <Flex align="center" gap={4}>
                          <Text>{index + 1}</Text>
                          {index > 0 && (
                            <IconButton
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                reorderAndSetPositions(index, index - 1)
                              }
                              icon={<ArrowUpIcon />}
                            >
                              Up
                            </IconButton>
                          )}
                          {index < fields.length - 1 && (
                            <IconButton
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                reorderAndSetPositions(index, index + 1)
                              }
                              icon={<ArrowDownIcon />}
                            >
                              Down
                            </IconButton>
                          )}
                          <FormErrorMessage>
                            {errors.actions?.[index]?.position?.message}
                          </FormErrorMessage>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex align="center" gap={2}>
                          <IconComponent />
                          <Flex fontWeight="bold">{field.name}</Flex>
                        </Flex>
                      </Td>

                      <Td>
                        <Editable defaultValue={field.targetLink}>
                          <EditablePreview
                            border="1px"
                            borderColor="gray.300"
                            px={2}
                            h="30px"
                            // w="80px"
                          />
                          <EditableInput
                            {...register(`actions.${index}.targetLink`)}
                            // w="80px"
                          />
                        </Editable>
                      </Td>

                      <Td>
                        <IconButton
                          label="Delete action"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => remove(index)}
                        />
                      </Td>
                    </>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {errors.actions?.root?.message && (
          <Text color="red">{errors.actions?.root?.message}</Text>
        )}
        <Flex w="full" justify="end">
          <Button
            type="submit"
            colorScheme="primary"
            //   isLoading={upsertActionsMutation.isPending}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </AdminSection>
  );
};

export default Actions;
