import * as yup from "yup";

export const createShopValidator = yup.object().shape({
  name: yup
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .required("Shop name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  zipCode: yup.number().required("Zip code is required"),
  tel: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Please enter a valid phone number",
    ),
});
