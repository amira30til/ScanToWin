import * as yup from "yup";
import i18n from "@/i18n";
export const createShopSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, () => i18n.t("validation.shopNameMinLength", { count: 2 }))
    .required(() => i18n.t("validation.shopNameRequired")),
  address: yup.string().required(() => i18n.t("validation.addressRequired")),
  city: yup.string().required(() => i18n.t("validation.cityRequired")),
  country: yup.string().required(() => i18n.t("validation.countryRequired")),
  zipCode: yup.number().required(() => i18n.t("validation.zipCodeRequired")),
  tel: yup
    .string()
    .required()
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, () =>
      i18n.t("validation.invalidPhone"),
    ),
});
