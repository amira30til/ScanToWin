import FortuneWheel from "./FortuneWheel";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// FUNCTIONS
import { getShopGameAssignement } from "@/services/adminService";
import { useEffect } from "react";
import Error from "@/components/Error";

const FORTUNE_WHEEL_ID = "c7fac82a-24e7-4a44-b1a0-b337faf37bd5";

const Play = () => {
  const { shopId } = useParams();

  const { data: activeGame } = useQuery({
    queryKey: ["shop-game-assignment", shopId],
    queryFn: async () => {
      const response = await getShopGameAssignement(shopId);
      return response.data.data.data;
    },
    enabled: !!shopId,
  });

  useEffect(() => {
    console.log(activeGame);
  }, [activeGame]);

  if (activeGame?.gameId === FORTUNE_WHEEL_ID) return <FortuneWheel />;

  return <Error />;
};

export default Play;
