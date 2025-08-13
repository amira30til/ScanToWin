import * as yup from "yup";
import i18n from "@/i18n";
const hexColorSchema = yup
  .string()
  .required("Color is required")
  .matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, () =>
    i18n.t("validation.invalidHexColor"),
  );

export const updateShopColorSchema = yup.object().shape({
  gameColor1: hexColorSchema,
  gameColor2: hexColorSchema,
});
