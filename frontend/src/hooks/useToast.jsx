import { useToast as useChakraToast } from "@chakra-ui/react";

const useToast = () => {
  const toast = useChakraToast();

  return (
    title,
    status,
    description = "",
    duration = 3000,
    isClosable = true,
  ) => {
    toast({
      title,
      status,
      description,
      duration,
      isClosable,
    });
  };
};

export default useToast;
