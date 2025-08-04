import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks";

import { getAdminById } from "@/services/adminService";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

import {
  Box,
  Heading,
  Flex,
  Button,
  Spinner,
  Text,
  Badge,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Mail, Phone } from "lucide-react";

const AdminDetails = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-by-id", adminId],
    queryFn: async () => {
      console.log(adminId);
      const response = await getAdminById(axiosPrivate, adminId);
      return response.data.data.admin;
    },
    enabled: !!adminId,
  });

  if (isLoading) return <Spinner colorScheme="secondary" />;

  return (
    <Box p={8}>
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="link"
        colorScheme="secondary"
        onClick={() => navigate("/super-admin")}
      >
        go back
      </Button>
      <Flex direction="column" gap={4} my={6}>
        <Flex align="center" gap={4}>
          <Heading size="md" fontWeight="semibold">
            Amine Zouari
            {admin.firstName} {admin.lastName}
          </Heading>
          <Badge display="flex" align="center" gap={1} colorScheme="secondary">
            <Mail size={16} />
            {admin.email}
          </Badge>
          <Badge display="flex" align="center" gap={1} colorScheme="secondary">
            <Phone size={16} />
            +2167452455{admin.tel}
          </Badge>

          <Badge
            colorScheme={
              admin.adminStatus === "ACTIVE"
                ? "green"
                : admin.adminStatus === "ARCHIVED"
                  ? "yellow"
                  : ""
            }
          >
            {admin.adminStatus}
          </Badge>
        </Flex>
        <Flex>
          <Text fontWeight="semibold" color="gray.600" me={2}>
            verification Code:{" "}
          </Text>
          <Text>2455{admin.verificationCode}</Text>
        </Flex>

        <Flex>
          <Text fontWeight="semibold" color="gray.600" me={2}>
            Created at:{" "}
          </Text>

          <Text>
            {format(parseISO(admin.createdAt), "MMMM d, yyyy à hh'h'mm", {
              locale: fr,
            })}
          </Text>
        </Flex>

        <Flex>
          <Text fontWeight="semibold" color="gray.600" me={2}>
            Last updated at:{" "}
          </Text>
          <Text>
            {" "}
            {format(parseISO(admin.updatedAt), "MMMM d, yyyy à hh'h'mm", {
              locale: fr,
            })}
          </Text>
        </Flex>

        <Heading size="md" fontWeight="semibold">
          Shops
          {admin.firstName} {admin.lastName}
        </Heading>
      </Flex>
    </Box>
  );
};

export default AdminDetails;
