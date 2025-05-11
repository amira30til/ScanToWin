import { Flex, Text, Input, VStack } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ label, color, onChange }) => {
  return (
    <VStack
      align="center"
      justify="between"
      spacing={6}
      maxW={{ base: "100%", lg: "40%" }}
    >
      <Text fontWeight="medium">{label}</Text>
      <HexColorPicker
        style={{
          width: "100%",
        }}
        color={color}
        onChange={onChange}
      />
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        bg="surface.main"
        focusBorderColor="primary.500"
        size="lg"
      />
    </VStack>
  );
};

const TwoColorPicker = ({ primary, secondary, setPrimary, setSecondary }) => {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify="center"
      gap={8}
      wrap="wrap"
    >
      <ColorPicker
        label="Primary Color"
        color={primary}
        onChange={setPrimary}
      />
      <ColorPicker
        label="Secondary Color"
        color={secondary}
        onChange={setSecondary}
      />
    </Flex>
  );
};

export default TwoColorPicker;
