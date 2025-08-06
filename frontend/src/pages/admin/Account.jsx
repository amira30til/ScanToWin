import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getShop } from "@/services/shopService";

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
              { label: "Email", value: shop.admin.email },
              { label: "Name", value: shop.name },
              { label: "Address", value: shop.address },
              { label: "Zip Code", value: shop.zipCode },
              { label: "Telephone", value: shop.tel },
              { label: "SIRET Number", value: shop.nbSiret },
              { label: "Country", value: shop.country },
            ].map((input, index) => (
              <FormControl key={index} p={6}>
                <FormLabel>{input.label}</FormLabel>
                <Input
                  readOnly
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
