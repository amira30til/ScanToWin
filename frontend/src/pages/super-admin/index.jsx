import Games from "./_components/games";
import Actions from "./_components/actions";
import Admins from "./_components/admins";

import { Flex, Box, Heading, Alert, AlertIcon } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

const SuperAdmin = () => {
  const { t } = useTranslation();

  return (
    <Box p={4} py={8}>
      <Heading size="lg">{t("superAdmin.homeTitle")}</Heading>

      <Flex direction="column" gap={8} py={8}>
        <Heading size="md">{t("superAdmin.adminsList")}</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Archived admins, won't be able to use their accounts, and the their
          games will be disabled
        </Alert>
        <Admins />

        <Heading size="md">{t("superAdmin.actionsList")}</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Non active actions, won't be shown to the admins
        </Alert>
        <Actions />

        <Heading size="md">Games</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Archived games will be seen as "coming soon" to the admins
        </Alert>
        <Games />
      </Flex>
    </Box>
  );
};

export default SuperAdmin;
