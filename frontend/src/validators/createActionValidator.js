import * as yup from "yup";

export const createActionValidator = yup
  .object({
    name: yup.string().required("Action name is required"),
  })
  .required();
