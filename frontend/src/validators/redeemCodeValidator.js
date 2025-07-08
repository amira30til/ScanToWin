import * as yup from "yup";

export const redeemCodeValidator = yup
  .object({
    digitOne: yup.string().required("Email is required"),
    digitTwo: yup.string().required("Email is required"),
    digitThree: yup.string().required("Email is required"),
    digitFour: yup.string().required("Email is required"),
  })
  .test("all-digits", "The provided code is invalid", (values) => {
    // If any digit is missing, fail with the general message
    return (
      values.digitOne &&
      values.digitTwo &&
      values.digitThree &&
      values.digitFour
    );
  });
