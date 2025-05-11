import { toast } from "vue3-toastify";

export const showToast = (
  message: string,
  props?: {
    isSuccess?: boolean;
  }
) => {
  toast(message, {
    autoClose: true,
    hideProgressBar: true,
    toastClassName: `border-l-4 ${
      props?.isSuccess ? "!border-primary" : "!border-red-500"
    } bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 !text-sm`,
    position: "bottom-right",
  });
};
