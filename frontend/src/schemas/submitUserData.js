import * as yup from "yup";
import i18n from "@/i18n";
export const submitUserDataSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, () => i18n.t("validation.firstNameMinLength", { count: 2 }))
    .required(() => i18n.t("validation.firstNameRequired")),
  lastName: yup
    .string()
    .min(2, () => i18n.t("validation.lastNameMinLength", { count: 2 }))
    .required(() => i18n.t("validation.lastNameRequired")),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, () =>
      i18n.t("validation.invalidEmail"),
    )
    .required(),
  tel: yup
    .string()
    .required()
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, () =>
      i18n.t("validation.invalidPhone"),
    ),
  agreeToPromotions: yup.boolean().default(false),
});
