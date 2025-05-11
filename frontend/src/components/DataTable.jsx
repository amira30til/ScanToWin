import { TableContainer, Thead, Tr, Th, Tbody, Table } from "@chakra-ui/react";

const DataTable = ({ data, headers, rows, ...rest }) => (
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
      <Tbody>
        {data?.map((item, index) => (
          <Tr key={index} fontSize="xs">
            {rows(item, index)}
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default DataTable;
