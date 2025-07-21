import * as yup from "yup";

export const pinCodeValidator = yup.object().shape({
  newPin: yup
    .string()
    .required("new pin is required")
    .matches(/^\d{4}$/, "new pin must be exactly 4 digits"),

  confirmPin: yup
    .string()
    .required("confirm pin is required")
    .oneOf([yup.ref("newPin")], "pins must match"),
});
