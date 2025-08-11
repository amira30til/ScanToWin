import LucideIconPicker from "./LucideIconPicker";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("update_icon_modal.title")}</ModalHeader>
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
