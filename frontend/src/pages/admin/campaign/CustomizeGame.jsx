// HOOKS
import { useEffect, useRef, useState } from "react";
import { useAxiosPrivate, useToast } from "@/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { decodeToken } from "@/utils/auth";
import useAuthStore from "@/store";

// FUNCTIONS
import { updateShopColorValidator } from "@/validators/updateShopColorValidator";
import { updateShop } from "@/services/shopService";
import { dataURLtoFile } from "@/utils/helpers";

// COMPONENTS
import TwoColorPicker from "@/components/TwoColorPicker";
import AdminSection from "@/components/common/AdminSection";

// STYLE
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Image,
  IconButton,
  useToken,
} from "@chakra-ui/react";

import { yupResolver } from "@hookform/resolvers/yup";
import { LuUpload, LuX } from "react-icons/lu";

const CustomizeGame = ({ shop }) => {
  const axiosPrivate = useAxiosPrivate();
  const { shopId } = useParams();
  const auth = useAuthStore((state) => state.auth);
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageValue, setImageValue] = useState();
  const [primary500] = useToken("colors", ["primary.500"]);

  const defaultValues = {
    gameColor1: "#0000ff",
    gameColor2: "#ff0000",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(updateShopColorValidator),
  });
  const { handleSubmit, watch } = methods;
  const gameColor1 = watch("gameColor1");
  const gameColor2 = watch("gameColor2");

  let adminId = decodeToken(auth?.accessToken);

  const onUpdateShopSuccess = async () => {
    await queryClient.invalidateQueries(["adminShops"]);
    toast("Shop updated successfully!", "success");
  };

  const onUpdateShopError = (error) => {
    console.log(error);
    toast("Failed to update shop!", "error");
  };

  const updateShopMutation = useMutation({
    mutationFn: async (data) => {
      await updateShop(axiosPrivate, shopId, adminId, data);
    },
    onSuccess: onUpdateShopSuccess,
    onError: onUpdateShopError,
  });

  const onSubmit = (values) => {
    if (!!adminId) {
      updateShopMutation.mutate(values);
    }
  };

  const onSaveImage = () => {
    if (!!imageValue && !!adminId) {
      const onError = () => {
        toast("Invalid image format", "error");
      };
      const formData = new FormData();
      formData.append("logo", dataURLtoFile(imageValue, "logo.png", onError));
      updateShopMutation.mutate(formData);
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPreviewImage(result);
        setImageValue(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPicture = () => {
    setPreviewImage(null);
    setImageValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerPictureUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (shop) {
      methods.reset({
        gameColor1: shop.gameColor1 || "#0000ff",
        gameColor2: shop.gameColor2 || "#ff0000",
      });
      setPreviewImage(shop.logo);
    }
  }, [shop]);

  return (
    <AdminSection
      title="Customize your game"
      description="Upload your logo and choose your colors to create a game that reflects your brand.
  Offer your customers a unique, fully customized experience."
    >
      <Flex
        direction={{ base: "column", md: "column" }}
        justify="space-between"
        align="center"
        gap={8}
      >
        <Flex
          direction="column"
          p={14}
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          gap={[20, 10]}
          align="center"
          w="100%"
          h="100%"
        >
          <Heading size="sm">Your Logo</Heading>

          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            {previewImage ? (
              <Box position="relative" width="fit-content">
                <Image
                  src={previewImage}
                  alt="Picture Preview"
                  maxHeight="400px"
                  borderRadius="md"
                />
                <IconButton
                  aria-label="Remove pictureUrl"
                  icon={<LuX size={16} />}
                  size="sm"
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  colorScheme="red"
                  rounded="full"
                  onClick={clearPicture}
                />
              </Box>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={5}
                cursor="pointer"
                onClick={triggerPictureUpload}
                _hover={{ borderColor: "primary.500" }}
                transition="all 0.2s"
                boxSize={{ base: 150, md: 250 }}
              >
                <LuUpload size={24} color={primary500} />
                <Text mt={2} fontSize="sm">
                  Upload a logo
                </Text>
              </Flex>
            )}
          </Box>
          <Flex w="full" justify="end">
            <Button
              colorScheme="primary"
              isLoading={updateShopMutation.isPending}
              onClick={onSaveImage}
              isDisabled={!imageValue}
            >
              Save
            </Button>
          </Flex>
        </Flex>
        <FormProvider {...methods}>
          <Flex
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            direction="column"
            p={14}
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            gap={14}
            align="center"
            w="100%"
          >
            <Heading size="sm">Choose your colors</Heading>
            <Flex direction={{ base: "column", lg: "row" }}>
              <TwoColorPicker />

              <Flex direction="column" justify="center" gap={8}>
                <Flex
                  gap={6}
                  mt={6}
                  w="100%"
                  justify="center"
                  align="center"
                  wrap="wrap"
                >
                  <Flex direction="column" align="center" gap={2}>
                    <Box
                      w="70px"
                      h="70px"
                      borderRadius="2xl"
                      bg={gameColor1}
                      border="2px solid"
                      borderColor="gray.300"
                      boxShadow="md"
                    />
                    <Text fontWeight="medium" color="gray.600">
                      Primary
                    </Text>
                  </Flex>

                  <Flex direction="column" align="center" gap={2}>
                    <Box
                      w="70px"
                      h="70px"
                      borderRadius="2xl"
                      bg={gameColor2}
                      border="2px solid"
                      borderColor="gray.300"
                      boxShadow="md"
                    />
                    <Text fontWeight="medium" color="gray.600">
                      Secondary
                    </Text>
                  </Flex>
                </Flex>
                {/* <Flex justify="center">
                  <Button size="sm" variant="outline" colorScheme="primary">
                    Show Preview
                  </Button>
                </Flex> */}
              </Flex>
            </Flex>
            <Flex w="full" justify="end">
              <Button
                type="submit"
                colorScheme="primary"
                isLoading={updateShopMutation.isPending}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </FormProvider>
      </Flex>
    </AdminSection>
  );
};

export default CustomizeGame;
