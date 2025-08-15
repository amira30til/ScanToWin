import { Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Actions from "./";

const ActionsPage = () => {
  const { t } = useTranslation(); 

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Actions Management
      </Heading>

      <Alert status="info" borderRadius="md" mb={6}>
        <AlertIcon />
        {t("superAdmin.alerts.nonActiveActions")}
      </Alert>

      <Actions />
    </Box>
  );
};

export default ActionsPage;
