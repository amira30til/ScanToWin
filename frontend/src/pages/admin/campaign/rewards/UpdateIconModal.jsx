import LucideIconPicker from "./LucideIconPicker";

import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Portal,
} from "@chakra-ui/react";

const UpdateIconModal = ({ onClose, isOpen, onSelectIcon }) => {
  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pick an Icon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <LucideIconPicker onSelect={onSelectIcon} />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Portal>
  );
};

export default UpdateIconModal;
