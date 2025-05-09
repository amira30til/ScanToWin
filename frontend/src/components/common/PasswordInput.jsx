import { forwardRef, useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const PasswordInput = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size={props.size}>
      <Input
        ref={ref}
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter a strong password"
        _placeholder={{
          fontSize: "md",
        }}
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
});

export default PasswordInput;
