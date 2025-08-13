import Games from "./_components/games";
import Actions from "./_components/actions";
import Admins from "./_components/admins";

import { Flex, Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SuperAdmin = () => {
  const { t } = useTranslation();

  return (
    <Flex direction="column" minH="100vh" p={4} py={8}>
      {/* main content */}
      <Box flex="1">
        <Heading size="lg">{t("superAdmin.homeTitle")}</Heading>

        <Flex direction="column" gap={8} py={8}>
          <Heading size="md">{t("superAdmin.adminsList")}</Heading>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {t("superAdmin.alerts.archivedAdmins")}
          </Alert>
          <Admins />

          <Heading size="md">{t("superAdmin.actionsList")}</Heading>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {t("superAdmin.alerts.nonActiveActions")}
          </Alert>
          <Actions />

          <Heading size="md">{t("superAdmin.gamesTitle")}</Heading>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {t("superAdmin.alerts.archivedGames")}
          </Alert>
          <Games />
        </Flex>
      </Box>

      <Box mt="auto" py={4} textAlign="center">
        <LanguageSwitcher />
      </Box>
    </Flex>
  );
};

export default SuperAdmin;
