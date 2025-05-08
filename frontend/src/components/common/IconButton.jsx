import { IconButton as ChakraIconButton, Tooltip } from "@chakra-ui/react";

const IconButton = ({ onClick, label, icon, ...rest }) => {
  return (
    <Tooltip label={label} hasArrow placement="top" openDelay={500}>
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

// Usage example:
//
// import { DeleteButton } from './DeleteButton';
//
// function MyComponent() {
//   const handleDelete = () => {
//     console.log('Delete clicked');
//     // Add your delete logic here
//   };
//
//   return (
//     <DeleteButton
//       onClick={handleDelete}
//       label="Delete this item"
//       size="md"
//     />
//   );
// }

// import React from "react";
// import { IconButton as ChakraIconButton } from "@chakra-ui/react";

// const IconButton = ({ icon, onClick, ...props }) => {
//   return <ChakraIconButton icon={icon} onClick={onClick} {...props} />;
// };

// export default IconButton;
