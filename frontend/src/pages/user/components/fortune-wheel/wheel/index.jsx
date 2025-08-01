import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "@chakra-ui/react";

import {
  getRewardsByShop,
  getShopRandomReward,
} from "@/services/rewardService";

import WheelCanvas from "./WheelCanvas";

import { VStack, Spinner, Box } from "@chakra-ui/react";

const Wheel = ({ onReward, primaryColor, secondaryColor }) => {
  const { shopId } = useParams();
  const [primary500] = useToken("colors", ["primary.500"]);
  const [secondary500] = useToken("colors", ["secondary.500"]);
  const [colors, setColors] = useState([]);
  const navigate = useNavigate();

  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["rewards-by-shop", shopId],
    queryFn: async () => {
      let primColor = primaryColor || primary500;
      let seconColor = secondaryColor || secondary500;
      const response = await getRewardsByShop(shopId);
      const fetchedRewards = response.data.data.rewards;
      setColors(extractColors(fetchedRewards, primColor, seconColor));
      return fetchedRewards;
    },
    enabled: !!shopId,
  });

  const { data: randomReward, isLoading: isLoadingRandomReward } = useQuery({
    queryKey: ["shop-random-reward", shopId],
    queryFn: async () => {
      const response = await getShopRandomReward(shopId);
      return response.data.data.reward;
    },
    enabled: !!shopId,
  });

  const onFinished = () => {
    onReward(randomReward);
  };

  useEffect(() => {
    if (rewards !== undefined && rewards.length < 1) {
      navigate(`/user/${shopId}/coming-soon`);
    }
  }, [rewards]);

  if (isLoadingRewards || isLoadingRandomReward) return <Spinner />;

  return (
    <VStack spacing={8}>
      <Box>
        <WheelCanvas
          segments={rewards}
          segColors={colors}
          onFinished={(reward) => onFinished(reward)}
          contrastColor="#000"
          borderColor={primaryColor || primary500}
          needleColor={lightenHexColor(secondaryColor || secondary500, 60)}
          buttonText="Spin"
          buttonTextColor="#252525"
          isOnlyOnce={true}
          size={140}
          fontSize="0.75em"
          fontFamily="Arial"
        />
      </Box>
    </VStack>
  );
};

const lightenHexColor = (hex, amount = 20) => {
  if (!hex) return;
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
