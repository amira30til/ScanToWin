import { useCallback, useState } from "react";
import useToast from "./useToast";

const useCopy = () => {
  const [copiedText, setCopiedText] = useState(null);
  const toast = useToast();

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast("Copied to clipboard", "success");
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      toast("Copy failed", "error");
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
};

export default useCopy;
