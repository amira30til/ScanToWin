import * as yup from "yup";

export const resetValidator = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address",
      )
      .required("Email is required"),

    verificationCode: yup
      .string()
      .required("PIN is required")
      .matches(/^\d{4}$/, "PIN must be a 4-digit number"),

    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character:[@$!%*?&]",
      ),
  })
  .required();
