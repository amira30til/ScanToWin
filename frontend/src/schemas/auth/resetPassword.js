import * as yup from "yup";
import i18n from "@/i18n";
export const resetPasswordSchema = yup
  .object({
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, () =>
        i18n.t("validation.invalidEmail"),
      )
      .required("Email is required"),

    verificationCode: yup
      .string()
      .required("PIN is required")
      .matches(/^\d{4}$/, () => i18n.t("validation.invalidPinFormat")),

    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        () => i18n.t("validation.passwordComplexity"),
      ),
  })
  .required();
