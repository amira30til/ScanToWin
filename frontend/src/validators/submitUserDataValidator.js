import * as yup from "yup";

export const submitUserDataValidator = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "first name must be at least 2 characters")
    .required("last name is required"),
  lastName: yup
    .string()
    .min(2, "last name must be at least 2 characters")
    .required("last name is required"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Must be a valid email address",
    )
    .required("Email is required"),
  tel: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Please enter a valid phone number",
    ),
  agreeToPromotions: yup.boolean().default(false),
});
