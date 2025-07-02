import { VStack } from "@chakra-ui/react";
import WheelComponent from "./WheelComponent";

const REWARDS = ["Drink", "Pizza", "Dessert", "Sandwich", "Icecream", "Coupon"];

const Wheel = ({ onReward, primaryColor, secondaryColor }) => {
  // TODO: fetch real rewards
  const COLORS = REWARDS.map((_, index) => {
    const baseColor = index % 2 === 0 ? primaryColor : secondaryColor;
    return lightenHexColor(baseColor, 100);
  });

  const onFinished = (reward) => {
    onReward(reward);
  };

  return (
    <VStack spacing={8}>
      <div>
        <WheelComponent
          segments={REWARDS}
          segColors={COLORS}
          onFinished={(reward) => onFinished(reward)}
          contrastColor="#000"
          borderColor={primaryColor}
          needleColor={lightenHexColor(secondaryColor, 60)}
          buttonText="Spin"
          buttonTextColor="#252525"
          isOnlyOnce={false}
          size={140}
          fontSize="0.75em"
          upDuration={500}
          downDuration={600}
          fontFamily="Arial"
        />
      </div>
    </VStack>
  );
};

function lightenHexColor(hex, amount = 20) {
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
}

export default Wheel;
