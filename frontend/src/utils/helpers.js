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

export const dataURLtoFile = (dataUrl, filename, onError = () => {}) => {
  if (!dataUrl.startsWith("data:image/")) {
    throw new Error("Only image files are allowed");
  }

  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(image\/(png|jpeg|jpg));base64/);

  if (!mimeMatch) {
    onError();
    throw new Error("Invalid image MIME type");
  }

  const mime = mimeMatch[1];
  const bstr = atob(base64);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
};

export const isPlainObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
