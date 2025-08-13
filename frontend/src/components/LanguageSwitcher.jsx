// src/components/LanguageSwitcher.tsx
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const current = i18n.language;

  const handleChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLabel =
    LANGS.find((l) => current.startsWith(l.code))?.label ?? "Français";

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        rightIcon={<ChevronDown size={16} />}
        size="sm"
      >
        <HStack spacing={2}>
          <Globe size={16} />
          <Text>{currentLabel}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {LANGS.map((l) => (
          <MenuItem key={l.code} onClick={() => handleChange(l.code)}>
            {l.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
