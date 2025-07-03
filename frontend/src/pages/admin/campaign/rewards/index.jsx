import { useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast, useAxiosPrivate } from "@/hooks";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { createReward, getRewardsByShop } from "@/services/rewardService";

import AdminSection from "@/components/common/AdminSection";
import DataTable from "@/components/DataTable";
import LucideIconPicker from "./LucideIconPicker";

import {
  Flex,
  Button,
  Td,
  FormLabel,
  Switch,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Editable,
  EditablePreview,
  EditableInput,
  useToken,
} from "@chakra-ui/react";
import IconButton from "@/components/common/IconButton";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";
// eslint-disable-next-line import/no-unresolved
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect } from "react";

const REWARDS = [
  {
    icon: "cup-soda",
    name: "Drink",
    nbRewardTowin: 20,
    percentage: 10,
    isUnlimited: true,
  },
];

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [primary500] = useToken("colors", ["primary.500"]);

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      rewards: REWARDS,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "rewards",
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards-by-shop"],
    queryFn: async () => {
      const response = await getRewardsByShop(axiosPrivate, shopId);
      return response.data.data.rewards;
    },
    enabled: !!shopId,
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    console.log(rewards);
  }, [rewards]);

  const rows = (reward, index) => (
    <>
      <Td>
        <DynamicIcon name={reward.icon} color={primary500} size={24} />
      </Td>
      <Td>{reward.name}</Td>

      <Td>
        <Editable defaultValue={reward.nbRewardTowin}>
          <EditablePreview w="100%" />
          <EditableInput
            {...register(`rewards.${index}.nbRewardTowin`, {
              valueAsNumber: true,
            })}
          />
        </Editable>
      </Td>

      <Td>
        <Editable defaultValue={reward.percentage}>
          <EditablePreview w="100%" />
          <EditableInput
            {...register(`rewards.${index}.percentage`, {
              valueAsNumber: true,
            })}
          />
        </Editable>
      </Td>

      <Td>
        <Switch
          colorScheme="primary"
          size="sm"
          {...register(`rewards.${index}.isUnlimited`)}
          isChecked={watch(`rewards.${index}.isUnlimited`)}
        />
      </Td>

      <Td>
        <IconButton
          label="Delete reward"
          icon={<DeleteIcon />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          // onClick={() => deleteRewardHandler(reward.id)}
        />
      </Td>
    </>
  );

  useEffect(() => {
    console.log(fields);
  }, [fields]);

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
              onClick={onOpen}
            >
              Add a reward
            </Button>
          </Flex>

          {fields && (
            <DataTable
              rows={rows}
              headers={HEADERS}
              data={fields}
              bg="surface.navigation"
            />
          )}
          <Flex w="full" justify="end">
            <Button
              type="submit"
              colorScheme="primary"
              // isLoading={updateShopMutation.isPending}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </AdminSection>

      <AddRewardModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

const AddRewardModal = ({ onClose, isOpen }) => {
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, control, setValue, reset } =
    useForm({
      defaultValues: {
        icon: "CupSoda",
        name: "",
        nbRewardTowin: 0,
        percentage: 0,
        isUnlimited: true,
      },
    });

  const onCreateAdminSuccess = () => {
    queryClient.invalidateQueries("rewards");
    reset();
    onClose();
    toast(SUCCESS_MESSAGES.REWARD_CREATE_SUCCESS, "success");
  };

  const onCreateAdminError = () => {
    toast(ERROR_MESSAGES.REWARD_CREATE_FAILED, "error");
  };

  const createAdminMutation = useMutation({
    mutationFn: async (data) => await createReward(axiosPrivate, data),
    onSuccess: onCreateAdminSuccess,
    onError: onCreateAdminError,
  });

  const onSubmitAddReward = (values) => {
    if (!!shopId) {
      // createAdminMutation.mutate({
      //   ...values,
      //   shopId,
      //   nbRewardTowin: +values.nbRewardTowin,
      //   winnerCount: +values.winnerCount,
      // })
      console.log("submitted add reward", {
        ...values,
        shopId,
        nbRewardTowin: +values.nbRewardTowin,
        percentage: +values.winnerCount,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmitAddReward)}>
        <ModalHeader>Add a reward</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={4}>
            <LucideIconPicker
              onSelect={(icon) => {
                setValue("icon", icon);
              }}
            />
            <FormControl isRequired>
              <FormLabel fontSize="sm">Name</FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="text"
                placeholder="reward name"
                autoFocus
                size="sm"
                {...register("name")}
              />

              <FormHelperText color="red.500">
                {formState.errors.name?.message}
              </FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Number of rewards to win</FormLabel>
              <Controller
                name="nbRewardTowin"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Number reward to win is required",
                  },
                }}
                render={({ field: { ref, ...restField } }) => (
                  <NumberInput
                    {...restField}
                    min={0}
                    focusBorderColor="primary.500"
                    size="sm"
                  >
                    <NumberInputField ref={ref} name={restField.name} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              ></Controller>
            </FormControl>
            <FormControl alignItems="center">
              <FormLabel htmlFor="is-unlimited" mb="0" fontSize="sm">
                Is unlimited
              </FormLabel>
              <Switch
                id="is-unlimited"
                colorScheme="primary"
                size="sm"
                defaultChecked={true}
                {...register("isUnlimited")}
              />
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme="primary">
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Rewards;
