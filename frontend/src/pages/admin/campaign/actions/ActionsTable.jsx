import { upsertActionsValidator } from "@/validators/upsertActionsValidator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "react-hook-form";

import IconButton from "@/components/common/IconButton";
import GoogleSvg from "@/assets/components/GoogleSvg";
import FacebookSvg from "@/assets/components/FacebookSvg";
import InstagramSvg from "@/assets/components/InstagramSvg";
import TiktokSvg from "@/assets/components/TiktokSvg";

import {
  Flex,
  Td,
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
  Text,
} from "@chakra-ui/react";

import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons";

const HEADERS = ["Order", "Action", "link", "actions"];

const actionIconMap = {
  "Avis Google": GoogleSvg,
  Facebook: FacebookSvg,
  Instagram: InstagramSvg,
  Tiktok: TiktokSvg,
};

const ActionsTable = ({ fields, move, remove }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext({
    resolver: yupResolver(upsertActionsValidator),
  });

  return (
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
          {fields.map((field, index) => {
            const IconComponent = actionIconMap[field.name];
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
                          onClick={() => {
                            move(index, index - 1);
                          }}
                          icon={<ArrowUpIcon />}
                        >
                          Up
                        </IconButton>
                      )}
                      {index < fields.length - 1 && (
                        <IconButton
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            move(index, index + 1);
                          }}
                          icon={<ArrowDownIcon />}
                        >
                          Down
                        </IconButton>
                      )}
                      <FormErrorMessage>
                        {errors.actionsByShop?.[index]?.position?.message}
                      </FormErrorMessage>
                    </Flex>
                  </Td>

                  <Td>
                    <Flex align="center" gap={2}>
                      <IconComponent />
                      <Text fontWeight="bold" fontSize="sm">
                        {field.name}
                      </Text>
                    </Flex>
                  </Td>

                  <Td>
                    <Editable defaultValue={field.targetLink}>
                      <EditablePreview
                        border="1px"
                        borderColor="gray.300"
                        px={2}
                        h="30px"
                        minW="160px"
                      />
                      <EditableInput
                        {...register(`actionsByShop.${index}.targetLink`)}
                        minW="160px"
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
  );
};

export default ActionsTable;
