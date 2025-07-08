import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getRewardsByShop,
  getShopRandomReward,
} from "@/services/rewardService";
import { VStack, Spinner } from "@chakra-ui/react";
import WheelCanvas from "./WheelCanvas";

const Wheel = ({ onReward, primaryColor, secondaryColor }) => {
  const { shopId } = useParams();
  const [colors, setColors] = useState([]);

  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["rewards-by-shop"],
    queryFn: async () => {
      const response = await getRewardsByShop(shopId);
      const fetchedRewards = response.data.data.rewards;
      setColors(extractColors(fetchedRewards, primaryColor, secondaryColor));
      return fetchedRewards;
    },
    enabled: !!shopId,
  });

  const { data: randomReward, isLoading: isLoadingRandomReward } = useQuery({
    queryKey: ["shop-random-reward"],
    queryFn: async () => {
      const response = await getShopRandomReward(shopId);
      return response.data.data.reward;
    },
    enabled: !!shopId,
  });

  const onFinished = () => {
    onReward(randomReward);
  };

  if (isLoadingRewards || isLoadingRandomReward) return <Spinner />;

  return (
    <VStack spacing={8}>
      <div>
        <WheelCanvas
          segments={rewards}
          segColors={colors}
          onFinished={(reward) => onFinished(reward)}
          contrastColor="#000"
          borderColor={primaryColor}
          needleColor={lightenHexColor(secondaryColor, 60)}
          buttonText="Spin"
          buttonTextColor="#252525"
          isOnlyOnce={false}
          size={140}
          fontSize="0.75em"
          fontFamily="Arial"
        />
      </div>
    </VStack>
  );
};

const lightenHexColor = (hex, amount = 20) => {
  let col = hex.replace("#", "");

  if (col.length === 3) {
    col = col
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(col, 16);
  let r = num >> 16;
  let g = (num >> 8) & 0x00ff;
  let b = num & 0x0000ff;

  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // If already bright (e.g., brightness > 200), skip lightening
  if (brightness > 200) {
    return `#${col}`;
  }

  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const extractColors = (rewards, primaryColor, secondaryColor) => {
  return rewards.map((_, index) => {
    const baseColor = index % 2 === 0 ? primaryColor : secondaryColor;
    return lightenHexColor(baseColor, 100);
  });
};

export default Wheel;
