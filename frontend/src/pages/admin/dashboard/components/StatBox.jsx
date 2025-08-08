import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const StatBox = ({ title, value, total, icon }) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <Stat bg="surface.popover" borderRadius="md" p={6}>
        <Flex gap={4}>
          <Flex direction="column" align="center" gap={4}>
            <Icon as={icon} boxSize={30}></Icon>
            <Box>{t("stat_box.total")}</Box>
            <StatNumber color="primary.700">{total?.length || 0}</StatNumber>
          </Flex>
          <Box>
            <Divider h="100%" orientation="vertical" />
          </Box>
          <Box>
            <StatLabel>{title}</StatLabel>
            <StatNumber color="primary.700">{value?.length || 0}</StatNumber>
            <StatHelpText>
              {((value?.length / total?.length) * 100 || 0).toFixed(2)}%
            </StatHelpText>
          </Box>
        </Flex>
      </Stat>
    </Flex>
  );
};

export default StatBox;
