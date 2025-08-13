import * as yup from "yup";
import i18n from "@/i18n";
export const pinCodeSchema = yup.object().shape({
  newPin: yup
    .string()
    .required(() => i18n.t("validation.newPinRequired"))
    .matches(/^\d{4}$/, () => i18n.t("validation.invalidPinFormat")),

  confirmPin: yup
    .string()
    .required(() => i18n.t("validation.confirmPinRequired"))
    .oneOf([yup.ref("newPin")], () => i18n.t("validation.pinsMustMatch")),
});
