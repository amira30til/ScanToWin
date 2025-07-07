import IconButton from "@/components/common/IconButton";
import { Grid, Input, VStack } from "@chakra-ui/react";
import * as LucideIcons from "lucide-react";
import { useEffect, useState } from "react";
import { pascalToKebab } from "@/utils/helpers";

const iconList = Object.keys(LucideIcons).filter(
  (key) => /^[A-Z]/.test(key) && !key.endsWith("Icon"),
);

export const LucideIconPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredIcons, setFilteredIcons] = useState([]);

  useEffect(() => {
    const allIcons = iconList.filter((icon) =>
      icon.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredIcons(allIcons.slice(0, 24));
  }, [search]);

  useEffect(() => {
    if (iconList !== undefined) {
      setFilteredIcons(iconList.slice(0, 24));
    }
  }, []);

  return (
    <div>
      <VStack spacing={4} align="stretch">
        <Input
          size="sm"
          colorScheme="primary"
          focusBorderColor="primary.500"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Grid templateColumns="repeat(auto-fill, minmax(40px, 1fr))" gap={2}>
          {filteredIcons?.map((name) => {
            const LucideIcon = LucideIcons[name];
            return (
              <IconButton
                label={pascalToKebab(name)}
                icon={<LucideIcon size={24} />}
                onClick={() => {
                  onSelect(pascalToKebab(name));
                }}
                key={name}
                boxSize={10}
                variant="outline"
                size="xs"
              />
            );
          })}
        </Grid>
      </VStack>
    </div>
  );
};

export default LucideIconPicker;
