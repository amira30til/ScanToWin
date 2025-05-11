import { IconButton as ChakraIconButton, Tooltip } from "@chakra-ui/react";

const IconButton = ({ onClick, label, icon, ...rest }) => {
  return (
    <Tooltip label={label} hasArrow placement="top" openDelay={100}>
      <ChakraIconButton
        aria-label={label}
        icon={icon}
        onClick={onClick}
        {...rest}
      />
    </Tooltip>
  );
};

export default IconButton;
