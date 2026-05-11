import { toast } from "sonner";

export const notify = {
  success: (title: string, description?: string) =>
    toast.success(title, { description }),
  error: (title: string, description?: string) =>
    toast.error(title, { description }),
  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),
  info: (title: string, description?: string) =>
    toast.info(title, { description }),
  loading: (title: string, description?: string) =>
    toast.loading(title, { description }),
  promise: toast.promise,
  dismiss: toast.dismiss,
};

export { toast };
