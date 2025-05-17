import * as yup from "yup";

const hexColorSchema = yup
  .string()
  .required("Color is required")
  .matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Must be a valid hex color");

export const updateShopColorValidator = yup.object().shape({
  gameColor1: hexColorSchema,
  gameColor2: hexColorSchema,
});
