import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getShop } from "@/services/shopService";
import { useTranslation } from "react-i18next";
import HeaderAdmin from "@/components/nav/HeaderAdmin";

import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
} from "@chakra-ui/react";

const Account = () => {
  const { t } = useTranslation();
  const { shopId } = useParams();

  const { data: shop } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  return (
    <Box pos="relative">
      <HeaderAdmin title="Account" />

      <Flex>
        {shop && (
          <SimpleGrid
            bg="surface.popover"
            w="full"
            m={10}
            columns={{ sm: 1, md: 2 }}
            gap={0}
          >
            {[
              { label: t("email"), value: shop.admin.email },
              { label: t("name"), value: shop.name },
              { label: t("address"), value: shop.address },
              { label: t("zipCode"), value: shop.zipCode },
              { label: t("telephone"), value: shop.tel },
              { label: t("siret"), value: shop.nbSiret },
              { label: t("country"), value: shop.country },
            ].map((input) => (
              <FormControl p={6}>
                <FormLabel>{input.label}</FormLabel>
                <Input
                  readoOnly
                  defaultValue={input.value}
                  size="lg"
                  mt={2}
                  focusBorderColor="primary.500"
                />
              </FormControl>
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </Box>
  );
};

export default Account;
