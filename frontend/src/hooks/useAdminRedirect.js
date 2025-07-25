import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks";
import { getAdminShops } from "@/services/shopService";

const useAdminRedirect = (adminId) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { shopId } = useParams();

  const {
    data: shops,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["adminShops"],
    queryFn: async () => {
      const response = await getAdminShops(axiosPrivate, adminId);
      return response.data.data.shops;
    },
    enabled: !!adminId,
  });

  useEffect(() => {
    if (!isLoading && !isFetching && shops) {
      if (shops?.length === 0) {
        navigate("/admin/create-shop", { replace: true });
      } else if (!shopId) {
        navigate(`/admin/${shops[0].id}/dashboard`, { replace: true });
      } else {
        const currentShop = shops.find((shop) => `${shop.id}` === shopId);
        if (!currentShop) {
          navigate("/admin/create-shop", { replace: true });
        }
      }
    }
  }, [isLoading, shopId, shops, navigate]);

  return { isLoading, error, shops };
};

export default useAdminRedirect;
