import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { upsertActionsValidator } from "@/validators/upsertActionsValidator";

import {
  Flex,
  Button,
  Text,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";

import GoogleSvg from "@/assets/components/GoogleSvg";
import FacebookSvg from "@/assets/components/FacebookSvg";
import InstagramSvg from "@/assets/components/InstagramSvg";
import TiktokSvg from "@/assets/components/TiktokSvg";
import { AddIcon } from "@chakra-ui/icons";

const actionIconMap = {
  "Avis Google": GoogleSvg,
  Facebook: FacebookSvg,
  Instagram: InstagramSvg,
  Tiktok: TiktokSvg,
};

const AddAction = ({ actions, append }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAction, setSelectedAction] = useState("");
  const [availableActions, setAvailableActions] = useState([]);

  const { watch } = useFormContext({
    resolver: yupResolver(upsertActionsValidator),
  });
  const watchedActions = watch("actionsByShop");

  const handleConfirm = () => {
    if (selectedAction) {
      addActionHandler(selectedAction);
    }
  };

  const addActionHandler = (name) => {
    onClose();
    append({ name });
  };

  useEffect(() => {
    const watchedNames = watchedActions?.map((a) => a.name) || [];

    const newActions = actions?.filter(
      (action) => !watchedNames.includes(action.name),
    );

    setAvailableActions(newActions);
  }, [watchedActions, actions]);

  return (
    <Flex>
      <Popover
        size="lg"
        returnFocusOnClose={false}
        placement="right"
        closeOnBlur={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            leftIcon={<AddIcon />}
            variant="solid"
            colorScheme="secondary"
            size="sm"
            onClick={onOpen}
            isDisabled={availableActions?.length < 1}
          >
            Add an action
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader fontWeight="semibold">Add an action</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text fontSize="sm">
              Choose an action to add to engage your customers
            </Text>

            <Divider my={2} />

            <RadioGroup
              colorScheme="primary"
              size="lg"
              onChange={setSelectedAction}
            >
              <Stack>
                {availableActions?.map((action) => {
                  const IconComponent = actionIconMap[action.name];

                  return (
                    <Radio key={action.id} value={action.name} gap={2}>
                      <Flex align="center" gap={2}>
                        {IconComponent && <IconComponent />}
                        <Text fontSize="lg">{action.name}</Text>
                      </Flex>
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </PopoverBody>
          <PopoverFooter display="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              <Button
                type="button"
                colorScheme="primary"
                onClick={handleConfirm}
                isDisabled={!selectedAction}
              >
                Confirm
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default AddAction;
