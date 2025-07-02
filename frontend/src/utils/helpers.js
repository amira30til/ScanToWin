import debounce from "lodash/debounce";

export const isDefined = (value) => value !== undefined && value !== null;

export const isEmptyArray = (value) =>
  !Array.isArray(value) || !value.length > 0;

export const isArray = (value) => Array.isArray(value);

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounceFieldValue = debounce((name, value, setValue) => {
  setValue(name, value);
}, 200);

export const pascalToKebab = (str) => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // handle inner caps
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // handle acronym-style (e.g. IDCard → ID-Card)
    .toLowerCase();
};
