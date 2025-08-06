import * as yup from "yup";

export const createGameSchema = yup
  .object({
    name: yup.string().required("name is required"),
    description: yup.string().required("description is required"),
    status: yup
      .string()
      .oneOf(["active", "archived"], "Invalid status")
      .required("Status is required"),
    pictureUrl: yup.string().required("picture is required"),
  })
  .required();
