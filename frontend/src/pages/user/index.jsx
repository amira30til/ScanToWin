import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getShopGameAssignement } from "@/services/gameService";
import { getShop } from "@/services/shopService";

import FortuneWheel from "./components/fortune-wheel";
import Error from "@/components/Error";
import UserCooldownModal from "./components/UserCooldownModal";
import Spinner from "@/components/Spinner";

const FORTUNE_WHEEL_NAME = "Fortune Wheel";

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
    if (
      activeGame !== undefined &&
      shop &&
      (activeGame.game.name !== FORTUNE_WHEEL_NAME || !shop.gameCodePin)
    ) {
      navigate(`/user/${shopId}/coming-soon`);
    }
  }, [shop, activeGame]);

  if (shopIsLoading || activeGameIsLoading) return <Spinner />;

  if (shopError || activeGameError) return <Error link={`/user/${shopId}`} />;

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
