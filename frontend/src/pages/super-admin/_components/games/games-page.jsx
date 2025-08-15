import { Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import Games from "./";
const GamesPage = () => {
  const { t } = useTranslation();

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Games Management
      </Heading>
      <Alert status="info" borderRadius="md" mb={6}>
        <AlertIcon />
        {t("superAdmin.alerts.archivedGames")}
      </Alert>
      <Games />
    </Box>
  );
};

export default GamesPage;
