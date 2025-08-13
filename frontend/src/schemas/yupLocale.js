import * as yup from "yup";
import i18n from "@/i18n";

yup.setLocale({
  mixed: {
    required: () => i18n.t("validation.required"),
    oneOf: ({ values }) =>
      i18n.t("validation.oneOf", { values: values.join(", ") }),
    notOneOf: ({ values }) =>
      i18n.t("validation.notOneOf", { values: values.join(", ") }),
  },
  string: {
    min: ({ min }) => i18n.t("validation.minLength", { count: min }),
    max: ({ max }) => i18n.t("validation.maxLength", { count: max }),
    email: () => i18n.t("validation.invalidEmail"),
    matches: () => i18n.t("validation.invalidFormat"),
  },
  number: {
    min: ({ min }) => i18n.t("validation.minNumber", { count: min }),
    max: ({ max }) => i18n.t("validation.maxNumber", { count: max }),
  },
  array: {
    min: ({ min }) => i18n.t("validation.minItems", { count: min }),
  },
});
