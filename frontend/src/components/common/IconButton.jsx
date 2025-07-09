import { IconButton as ChakraIconButton, Tooltip } from "@chakra-ui/react";

const IconButton = ({ onClick, label, icon, children, ...rest }) => {
  return (
    <Tooltip label={label} hasArrow placement="top" openDelay={100}>
      <ChakraIconButton
        aria-label={label}
        icon={icon}
        onClick={onClick}
        {...rest}
      >
        {children}
      </ChakraIconButton>
    </Tooltip>
  );
};

export default IconButton;
