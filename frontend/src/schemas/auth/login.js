import * as yup from "yup";
import i18n from "@/i18n";
export const loginSchema = yup
  .object({
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, () =>
        i18n.t("validation.invalidEmail"),
      )
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters"),
  })
  .required();
