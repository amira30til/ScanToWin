import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "@/hooks";
import useAuthStore from "@/store";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getAdminShops } from "@/services/superAdminService";
import Spinner from "@/components/Spinner"; // Replace with your actual Spinner
import Error from "@/components/Error";

const AdminEntryRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const axiosPrivate = useAxiosPrivate();

  let adminId = decodeToken(auth);

  const {
    data: shops,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", adminId],
    queryFn: async () => {
      const response = await getAdminShops(axiosPrivate, adminId);
      return response.data.data.shops;
    },
    enabled: !!adminId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!shops) return;
    if (shops.length === 0) {
      navigate("/admin/create-shop", { replace: true });
    } else {
      const fallbackShopId = shops[0].id;
      navigate(`/admin/shops/${fallbackShopId}/dashboard`, { replace: true });
    }
  }, [shops]);

  if (isLoading) return <Spinner />;

  if (error) return <Error />;

  return null;
};

const decodeToken = (auth) => {
  if (auth?.accessToken) {
    try {
      const { sub } = jwtDecode(auth.accessToken);
      return sub;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
};

export default AdminEntryRedirect;
