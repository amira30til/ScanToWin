import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiGlobe, FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/styles.js";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MotionMenuButton = motion(MenuButton);
const MotionMenuList = motion(MenuList);
const MotionMenuItem = motion(MenuItem);

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const currentLang = i18n.language || "fr";
  const [isOpen, setIsOpen] = useState(false);

  const textPrimary = useColorModeValue(
    globalStyles.colors.text.primary,
    "white",
  );

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng", code);
  };

  const current =
    LANGUAGES.find((lang) => currentLang.startsWith(lang.code)) || LANGUAGES[0];

  return (
    <Menu onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
      <MotionMenuButton
        as={Button}
        variant="ghost"
        size="sm"
        leftIcon={<FiGlobe size={18} />}
        rightIcon={
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={14} />
          </motion.div>
        }
        borderRadius="md"
        border="1px solid"
        borderColor="whiteAlpha.400"
        px={2}
        py={5}
        bg="whiteAlpha.200"
        _hover={{
          bg: "whiteAlpha.300",
          borderColor: "whiteAlpha.500",
        }}
        _active={{
          bg: "whiteAlpha.300",
          borderColor: "whiteAlpha.500",
        }}
        fontWeight="medium"
        transition="all 0.2s"
        initial={false}
        animate={{
          scale: isOpen ? 0.98 : 1,
          transition: { duration: 0.1 },
        }}
      >
        <HStack spacing={1.5}>
          <Text fontSize="lg">{current.flag}</Text>
          <Text
            fontSize="sm"
            display={{ base: "none", md: "block" }}
            color={textPrimary}
          >
            {current.name}
          </Text>
        </HStack>
      </MotionMenuButton>

      <AnimatePresence>
        {isOpen && (
          <MotionMenuList
            borderRadius={globalStyles.radii.md}
            boxShadow="0 10px 25px rgba(0,0,0,0.1)"
            py={2}
            px={2}
            minW="180px"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            bg="whiteAlpha.200"
            border="1px solid"
            borderColor="whiteAlpha.400"
            _hover={{
              bg: "whiteAlpha.300",
              borderColor: "whiteAlpha.500",
            }}
          >
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang.startsWith(lang.code);
              return (
                <MotionMenuItem
                  as={Button}
                  variant="ghost"
                  size="sm"
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  bg="transparent"
                  _hover={{
                    bg: "whiteAlpha.300",
                  }}
                  _active={{
                    bg: "whiteAlpha.300",
                  }}
                  borderRadius="md"
                  fontWeight="medium"
                  px={2}
                  py={5}
                  initial={false}
                >
                  <HStack
                    spacing={1}
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack spacing={1}>
                      <Text fontSize="lg">{lang.flag}</Text>
                      <Text fontSize="sm">{lang.name}</Text>
                    </HStack>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Box
                          w="6px"
                          h="6px"
                          bg="primary.500"
                          borderRadius="full"
                        />
                      </motion.div>
                    )}
                  </HStack>
                </MotionMenuItem>
              );
            })}
          </MotionMenuList>
        )}
      </AnimatePresence>
    </Menu>
  );
}
