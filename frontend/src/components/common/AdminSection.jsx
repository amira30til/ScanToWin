import { Flex, Heading, Text } from "@chakra-ui/react";

const Section = ({ title, description, children }) => {
  return (
    <Flex
      direction="column"
      gap={10}
      bg="surface.navigation"
      padding={10}
      border="2px"
      borderColor="gray.100"
      borderRadius="md"
    >
      <Flex direction="column" gap={2}>
        <Heading size="md">{title}</Heading>
        <Text color="gray.500">{description}</Text>
      </Flex>

      {children}
    </Flex>
  );
};

export default Section;
