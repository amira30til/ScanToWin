import { useState, useEffect } from "react";
import {
  Flex,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { Controller, useFormContext } from "react-hook-form";
import { useDebounceCallback } from "@/hooks";

const TwoColorPicker = () => {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify="center"
      gap={8}
      wrap="wrap"
    >
      <ColorPicker name="gameColor1" label="Primary Color" />
      <ColorPicker name="gameColor2" label="Secondary Color" />
    </Flex>
  );
};

const ColorPicker = ({ name, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      isInvalid={!!errors[name]}
      as={Controller}
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <>
          <DebouncedColorInput
            label={label}
            value={value}
            onChange={onChange}
          />
          <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
        </>
      )}
    />
  );
};

const DebouncedColorInput = ({ label, value, onChange }) => {
  const debouncedOnChange = useDebounceCallback(onChange, 200);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleColorPickerChange = (color) => {
    setLocalValue(color);
    debouncedOnChange(color);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <Flex direction="column" gap={2} maxW={{ base: "100%", lg: "40%" }}>
      <VStack align="center" justify="between" spacing={6}>
        <FormLabel fontWeight="medium">{label}</FormLabel>
        <HexColorPicker
          style={{ width: "100%" }}
          color={value}
          onChange={handleColorPickerChange}
        />
        <Input
          value={localValue}
          onChange={handleInputChange}
          bg="surface.main"
          focusBorderColor="primary.500"
          size="lg"
        />
      </VStack>
    </Flex>
  );
};

export default TwoColorPicker;
