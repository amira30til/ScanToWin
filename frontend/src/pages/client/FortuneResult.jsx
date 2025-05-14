import React, { useEffect, useState } from "react";
import {
  ModalFooter,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  HStack,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const celebrate = keyframes`
  0%   { transform: scale(0.95); opacity: 0; }
  25%  { transform: scale(1.05); opacity: 1; }
  50%  { transform: scale(0.98); }
  75%  { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const FortuneResult = ({ gift, onClose, isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onClose={onClose}
      isCentered
      mt={6}
      p={6}
      bg="white"
      borderRadius="xl"
      borderWidth="2px"
      borderColor="primary.100"
      boxShadow="lg"
      maxW="md"
      mx="auto"
    >
      <ModalOverlay />
      <ModalContent
        as="form"
        //  onSubmit={handleSubmit(onSubmit)}
        animation={isOpen ? `${celebrate} 0.8s ease-out forwards` : "none"}
        opacity={isOpen ? 1 : 0}
      >
        <HStack mt={6} justify="center" gap={1}>
          {[...Array(3)].map((_, i) => (
            <Text
              key={i}
              fontSize="2xl"
              color="fortune.yellow"
              css={{
                animation: `${float} 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              🎁
            </Text>
          ))}
        </HStack>
        <ModalHeader align="center" pb="0">
          You Won a {gift}!
        </ModalHeader>
        <ModalBody>
          <Text pb={2} fontSize="sm" align="center" color="gray.500">
            Please enter your email so you can have the gift!
          </Text>

          <Flex direction="column" gap={2}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Name
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                placeholder="your name"
                autoFocus
                size="sm"
                // {...register("name")}
              />

              <FormHelperText color="red.500">
                {/* {formState.errors.name?.message} */}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Email
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="email"
                placeholder="email"
                size="sm"
                // {...register("email")}
              />

              <FormHelperText color="red.500">
                {/* {formState.errors.email?.message} */}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Phone
              </FormLabel>
              <Input
                focusBorderColor="primary.500"
                type="tel"
                placeholder="your phone number"
                size="sm"
                // {...register("phone")}
              />

              <FormHelperText color="red.500">
                {/* {formState.errors.phone?.message} */}
              </FormHelperText>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex justify="center" w="100%">
            <Button type="submit" colorScheme="primary">
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FortuneResult;
