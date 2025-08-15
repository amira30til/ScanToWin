import { Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Admins from "./";

const AdminsPage = () => {
  const { t } = useTranslation();

  return (
    <Box p={4}>
      {/* Title */}
      <Heading size="lg" mb={4}>
        Admins Management
      </Heading>

      {/* Info Alert */}
      <Alert status="info" borderRadius="md" mb={6}>
        <AlertIcon />
        {t("superAdmin.alerts.archivedAdmins")}
      </Alert>

      {/* Admins Table */}
      <Admins />
    </Box>
  );
};

export default AdminsPage;
