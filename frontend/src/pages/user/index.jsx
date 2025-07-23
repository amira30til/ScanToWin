import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getShopGameAssignement } from "@/services/adminService";

import FortuneWheel from "./fortune-wheel";
import Error from "@/components/Error";
import UserCooldownModal from "./components/UserCooldownModal";

const FORTUNE_WHEEL_ID = "c7fac82a-24e7-4a44-b1a0-b337faf37bd5";

const Play = () => {
  const { shopId } = useParams();

  const { data: activeGame, error } = useQuery({
    queryKey: ["shop-game-assignment", shopId],
    queryFn: async () => {
      const response = await getShopGameAssignement(shopId);
      const result = response.data.data.data;
      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return response.data.data.data;
    },
    enabled: !!shopId,
  });

  if (error) return <Error />;

  return (
    <>
      {activeGame?.gameId === FORTUNE_WHEEL_ID ? (
        <FortuneWheel />
      ) : (
        <div>This shop didn't select a game yet!</div>
      )}
      <UserCooldownModal
        title="You have already played today!"
        description="you can play again in"
      />
    </>
  );
};

export default Play;
