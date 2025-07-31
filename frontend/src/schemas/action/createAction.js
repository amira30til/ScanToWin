import * as yup from "yup";

export const createActionSchema = yup
  .object({
    name: yup.string().required("Action name is required"),
  })
  .required();
