import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useForm, useFieldArray } from "react-hook-form";

import { upsertRewards, getRewardsByShop } from "@/services/rewardService";
import { upsertRewardsValidator } from "@/validators/upsertRewardsValidator";
import { yupResolver } from "@hookform/resolvers/yup";

import AdminSection from "@/components/common/AdminSection";
import UpdateIconModal from "./UpdateIconModal";

import {
  Flex,
  Box,
  Button,
  Td,
  Switch,
  useDisclosure,
  Editable,
  EditablePreview,
  EditableInput,
  useToken,
  Spinner,
  IconButton as ChakraIconButton,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Table,
  FormErrorMessage,
  FormControl,
  Text,
} from "@chakra-ui/react";
import IconButton from "@/components/common/IconButton";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
// eslint-disable-next-line import/no-unresolved
import { DynamicIcon } from "lucide-react/dynamic";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";

const HEADERS = [
  "icon",
  "name",
  "number of rewards",
  "percentage %",
  "is unlimited",
  "actions",
];

const Rewards = () => {
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [primary500] = useToken("colors", ["primary.500"]);
  const [currentReward, setCurrentReward] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["rewards-by-shop"],
    queryFn: async () => {
      const response = await getRewardsByShop(shopId);
      return response.data.data.rewards;
    },
    enabled: !!shopId,
  });

  const onUpsertRewardsSuccess = () => {
    queryClient.invalidateQueries("rewards-by-shop");
    toast(SUCCESS_MESSAGES.REWARD_UPDATE_SUCCESS, "success");
  };

  const onUpsertRewardsError = () => {
    toast(ERROR_MESSAGES.REWARD_UPDATE_FAILED, "error");
  };

  const upsertRewardsMutation = useMutation({
    mutationFn: async (values) => await upsertRewards(axiosPrivate, values),
    onSuccess: onUpsertRewardsSuccess,
    onError: onUpsertRewardsError,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(upsertRewardsValidator),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rewards",
    keyName: "hook_form_id",
  });
  const watchedRewards = watch("rewards");
  const controlledRewards = fields.map((field, index) => {
    return {
      ...field,
      ...watchedRewards[index],
    };
  });

  const onSubmit = (values) => {
    const { rewards } = values;

    if (rewards.length === 1 && rewards[0].isUnlimited === false) {
      toast(ERROR_MESSAGES.REWARD_AT_LEAST_UNLIMITED, "warning");
      return;
    }

    const formattedRewards = [];
    let totalPercentage = 0;

    for (const reward of rewards) {
      const isUnlimited = reward.isUnlimited === true;

      const percentage = +reward.percentage || 0;
      totalPercentage += percentage;

      formattedRewards.push({
        ...reward,
        shopId,
        nbRewardTowin: isUnlimited ? 0 : +reward.nbRewardTowin || 0,
        percentage,
      });
    }

    if (totalPercentage !== 100) {
      toast(ERROR_MESSAGES.REWARD_TOTAL_PERCENTAGE, "warning");
      return;
    }

    if (!!shopId) {
      upsertRewardsMutation.mutate({
        shopId,
        rewards: formattedRewards,
      });
    }
  };

  const onIconOpen = (index) => {
    setCurrentReward(index);
    onOpen();
  };

  const onSelectIcon = (icon) => {
    setValue(`rewards.${currentReward}.icon`, icon);
    onClose();
  };

  useEffect(() => {
    if (rewards?.length) {
      reset({ rewards });
    }
  }, [rewards, reset]);

  if (isLoadingRewards) return <Spinner />;

  return (
    <>
      <AdminSection
        as="form"
        title="Choose rewards"
        description="Choose the rewards your customers can win by playing. Customize your prizes to offer a unique and engaging experience."
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
                  icon: "cup-soda",
                  nbRewardTowin: 0,
                  percentage: 0,
                  isUnlimited: false,
                  isActive: true,
                });
              }}
            >
              Add a reward
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
                {controlledRewards.map((field, index) => {
                  return (
                    <Tr key={field.hook_form_id} fontSize="xs">
                      <>
                        <Td>
                          <ChakraIconButton
                            icon={
                              <DynamicIcon
                                name={field.icon}
                                color={primary500}
                                size={24}
                              />
                            }
                            onClick={() => onIconOpen(index)}
                          ></ChakraIconButton>
                        </Td>
                        <Td>
                          <FormControl
                            isInvalid={!!errors.rewards?.[index]?.name}
                          >
                            <Editable defaultValue={field.name}>
                              <EditablePreview
                                border="1px"
                                borderColor="gray.300"
                                px={2}
                                h="30px"
                                w="150px"
                              />
                              <EditableInput
                                placeholder="name of the reward"
                                {...register(`rewards.${index}.name`)}
                                w="150px"
                              />
                            </Editable>
                            <FormErrorMessage>
                              {errors.rewards?.[index]?.name?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Td>

                        <Td>
                          {field.isUnlimited === true ? (
                            <Box
                              border="1px"
                              borderColor="gray.300"
                              px={2}
                              h="30px"
                              w="80px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              -
                            </Box>
                          ) : (
                            <Editable
                              defaultValue={
                                field.nbRewardTowin?.toString() || "0"
                              }
                            >
                              <EditablePreview
                                border="1px"
                                borderColor="gray.300"
                                px={2}
                                h="30px"
                                w="80px"
                              />
                              <EditableInput
                                {...register(`rewards.${index}.nbRewardTowin`, {
                                  valueAsNumber: true,
                                })}
                                w="80px"
                              />
                            </Editable>
                          )}
                        </Td>

                        <Td>
                          <Editable defaultValue={field.percentage.toString()}>
                            <EditablePreview
                              w="80px"
                              border="1px"
                              borderColor="gray.300"
                              px={2}
                              h="30px"
                            />
                            <EditableInput
                              {...register(`rewards.${index}.percentage`, {
                                valueAsNumber: true,
                              })}
                              maxW="80px"
                            />
                          </Editable>
                        </Td>

                        <Td>
                          <Switch
                            colorScheme="primary"
                            size="sm"
                            {...register(`rewards.${index}.isUnlimited`)}
                            isChecked={field.isUnlimited}
                          />
                        </Td>

                        <Td>
                          <IconButton
                            label="Delete reward"
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
          {errors.rewards?.root?.message && (
            <Text color="red">{errors.rewards?.root?.message}</Text>
          )}
          <Flex w="full" justify="end">
            <Button
              type="submit"
              colorScheme="primary"
              isLoading={upsertRewardsMutation.isPending}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </AdminSection>

      <UpdateIconModal
        onClose={onClose}
        isOpen={isOpen}
        onSelectIcon={onSelectIcon}
      />
    </>
  );
};

export default Rewards;
