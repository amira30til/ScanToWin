import * as yup from "yup";

export const redeemCodeSchema = yup
  .object({
    digitOne: yup.string().required("Digit is required"),
    digitTwo: yup.string().required("Digit is required"),
    digitThree: yup.string().required("Digit is required"),
    digitFour: yup.string().required("Digit is required"),
  })
  .test("all-digits", "The provided code is invalid", function (values) {
    if (!values) return false;

    const { digitOne, digitTwo, digitThree, digitFour } = values;
    return (
      !!digitOne?.trim() &&
      !!digitTwo?.trim() &&
      !!digitThree?.trim() &&
      !!digitFour?.trim()
    );
  });
