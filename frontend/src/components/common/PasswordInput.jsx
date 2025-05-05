import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

function PasswordInput(props) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size={props.size}>
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        {...props}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          variant="link"
          aria-label={show ? "Hide password" : "Show password"}
          icon={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          onClick={handleClick}
          color="#000"
        />
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;
