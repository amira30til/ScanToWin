import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getShopGameAssignement } from "@/services/adminService";
import { getShop } from "@/services/shopService";

import FortuneWheel from "./components/fortune-wheel";
import Error from "@/components/Error";
import UserCooldownModal from "./components/UserCooldownModal";
import Spinner from "@/components/Spinner";

const FORTUNE_WHEEL_ID = "c7fac82a-24e7-4a44-b1a0-b337faf37bd5";

const Play = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const {
    data: activeGame,
    isLoading: activeGameIsLoading,
    error: activeGameError,
  } = useQuery({
    queryKey: ["shop-game-assignment", shopId],
    queryFn: async () => {
      const response = await getShopGameAssignement(shopId);
      const result = response.data.data.data;
      if (Array.isArray(result) && result.length === 0) {
        return { gameId: "" };
      }
      return response.data.data.data;
    },
    enabled: !!shopId,
  });

  const {
    data: shop,
    isLoading: shopIsLoading,
    error: shopError,
  } = useQuery({
    queryKey: ["shop-by-id", shopId],
    queryFn: async () => {
      const response = await getShop(shopId);
      return response.data.data.shop;
    },
    enabled: !!shopId,
  });

  useEffect(() => {
    if (activeGame !== undefined && activeGame.gameId !== FORTUNE_WHEEL_ID) {
      navigate(`/play/${shopId}/coming-soon`);
    }
  }, [activeGame]);

  if (shopIsLoading || activeGameIsLoading) return <Spinner />;

  if (shopError || activeGameError) return <Error link={`/play/${shopId}`} />;

  return (
    <>
      <FortuneWheel shop={shop} />
      <UserCooldownModal
        title="You have already played today!"
        description="you can play again in"
      />
    </>
  );
};

export default Play;
