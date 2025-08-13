import * as yup from "yup";
import i18n from "@/i18n";
export const redeemCodeSchema = yup
  .object({
    digitOne: yup.string().required(() => i18n.t("validation.digitRequired")),
    digitTwo: yup.string().required(() => i18n.t("validation.digitRequired")),
    digitThree: yup.string().required(() => i18n.t("validation.digitRequired")),
    digitFour: yup.string().required(() => i18n.t("validation.digitRequired")),
  })
  .test(
    "all-digits",
    () => i18n.t("validation.invalidCode"),
    function (values) {
      if (!values) return false;

      const { digitOne, digitTwo, digitThree, digitFour } = values;
      return (
        !!digitOne?.trim() &&
        !!digitTwo?.trim() &&
        !!digitThree?.trim() &&
        !!digitFour?.trim()
      );
    },
  );
