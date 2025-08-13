import * as yup from "yup";
import i18n from "@/i18n";
export const createGameSchema = yup
  .object({
    name: yup.string().required(),
    description: yup
      .string()
      .required(() => i18n.t("validation.descriptionRequired")),
    status: yup
      .string()
      .oneOf(["active", "archived"], )
      .required(),
    pictureUrl: yup
      .string()
      .required(() => i18n.t("validation.pictureRequired")),
  })
  .required();
