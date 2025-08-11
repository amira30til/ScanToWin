import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address",
      )
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters"),
  })
  .required();
