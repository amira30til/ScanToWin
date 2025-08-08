import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCopy, useAxiosPrivate, useToast } from "@/hooks";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToken } from "@chakra-ui/react";

import { updateShop, getShop } from "@/services/shopService";
import { yupResolver } from "@hookform/resolvers/yup";
import { pinCodeSchema } from "@/schemas/reward/pinCode";

import QRCode from "react-qr-code";

import {
  Box,
  Flex,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Portal,
  ModalCloseButton,
  ModalFooter,
  Alert,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  FormHelperText,
} from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
  DownloadIcon,
  CopyIcon,
  AlertIcon,
} from "@chakra-ui/icons";
import { Lock, QrCode } from "lucide-react";

const HeaderAdmin = ({ title }) => {
  const svgRef = useRef(null);
  const { shopId } = useParams();
  const [_, copy] = useCopy();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sidebarWidth] = useToken("sizes", ["sidebar"]);

  const copyQrLinkHandler = () => {
    const qrCodeLink = `${import.meta.env.VITE_FRONTEND_URL}/user/${shopId}`;
    copy(qrCodeLink);
  };

  const downloadQRCode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    // Create a canvas
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Convert SVG to XML string
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // Create image from SVG blob
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Trigger download
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    };
    img.src = url;
  };

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        bg="surface.navigation"
        shadow="sm"
        w="100%"
        zIndex="4"
        pe={8}
        ps={{ sm: 8, md: `calc(${sidebarWidth} + 32px)` }}
        pb={4}
        pt={{ sm: 12, md: 4 }}
      >
        <Flex justify="space-between" align="center">
          <Heading size="lg">{title}</Heading>
          <Flex direction={{ sm: "column", md: "row" }} gap={2}>
            <Button
              leftIcon={<Lock size={20} />}
              size="sm"
              colorScheme="secondary"
              variant="outline"
              onClick={onOpen}
            >
              My PIN Code
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<QrCode size={20} />}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                colorScheme="secondary"
              >
                QR Code
              </MenuButton>
              <MenuList>
                <Flex justify="center" py={2} my={2}>
                  <Box maxW={160}>
                    <QRCode
                      ref={svgRef}
                      style={{
                        height: "auto",
                        width: "100%",
                      }}
                      value={`${import.meta.env.VITE_FRONTEND_URL}/user/${shopId}`}
                      viewBox={`0 0 256 256`}
                    />
                  </Box>
                </Flex>

                <MenuItem as="div">
                  <Button
                    leftIcon={<CopyIcon />}
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    w="full"
                    onClick={copyQrLinkHandler}
                  >
                    Copy QR Link
                  </Button>
                </MenuItem>
                <MenuItem as="div">
                  <Button
                    leftIcon={<DownloadIcon />}
                    size="sm"
                    colorScheme="primary"
                    w="full"
                    onClick={downloadQRCode}
                  >
                    Download QR Code
                  </Button>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
      <PinCodeModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const PinCodeModal = ({ isOpen, onClose }) => {
  const { shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: shop, refetch } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(pinCodeSchema) });

  const onUpdateShopSuccess = async () => {
    await queryClient.invalidateQueries(["shop-by-id", shopId]);
    refetch();
    toast("Code PIN updated!", "success");
    reset();
    onClose();
  };

  const onUpdateShopError = (error) => {
    console.log(error);
    toast("Failed to update code PIN!", "error");
  };

  const updateShopMutation = useMutation({
    mutationFn: async (data) =>
      await updateShop(axiosPrivate, shopId, data.adminId, {
        gameCodePin: data.gameCodePin,
      }),
    onSuccess: onUpdateShopSuccess,
    onError: onUpdateShopError,
  });

  const onSubmit = (values) => {
    if (!!shopId) {
      updateShopMutation.mutate({
        gameCodePin: values.newPin,
        adminId: shop.adminId,
      });
    }
  };
  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Activate your pin code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={6}>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                To secure gift collection, each customer will need to present a
                PIN code to be validated by your team (cash register, counter,
                reception, etc.).
              </Alert>
              <Alert status="info" variant="left-accent" borderRadius="md">
                <AlertIcon />
                Specify your pin code
              </Alert>
              <Flex gap={4}>
                {shop?.gameCodePin && (
                  <FormControl>
                    <FormLabel>Current PIN code</FormLabel>
                    <Input
                      defaultValue={shop?.gameCodePin}
                      disabled
                      size="lg"
                      mt={2}
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>
                    Your {shop?.gameCodePin && "new"} PIN code
                  </FormLabel>
                  <Input
                    focusBorderColor="primary.500"
                    placeholder="****"
                    autoFocus
                    size="lg"
                    mt={2}
                    maxLength="4"
                    {...register("newPin")}
                  />

                  <FormHelperText color="red.500">
                    {errors?.newPin?.message}
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Confirm your PIN code</FormLabel>
                  <Input
                    focusBorderColor="primary.500"
                    placeholder="****"
                    size="lg"
                    mt={2}
                    {...register("confirmPin")}
                    maxLength="4"
                  />

                  <FormHelperText color="red.500">
                    {errors?.confirmPin?.message}
                  </FormHelperText>
                </FormControl>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="primary" mr={3}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
};

export default HeaderAdmin;
