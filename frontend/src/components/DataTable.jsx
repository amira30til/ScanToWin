import { TableContainer, Thead, Tr, Th, Tbody, Table } from "@chakra-ui/react";

const DataTable = ({ headers, children, ...rest }) => (
  <TableContainer
    border="1px"
    borderColor="gray.300"
    minHeight="350px"
    bg="#fff"
    {...rest}
  >
    <Table variant="simple">
      <Thead bg="primary.100">
        <Tr>
          {headers?.map((header, index) => (
            <Th key={index}>{header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>{children}</Tbody>
    </Table>
  </TableContainer>
);

export default DataTable;
