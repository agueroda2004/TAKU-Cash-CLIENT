import toast from "react-hot-toast";
import Toast from "../shared/ui/Toast";

export function notify({ success, message }: { success: boolean; message: string }) {
  toast.custom(
    (t) => <Toast variant={success ? "success" : "error"} message={message} t={t} />,
    { duration: 4000 },
  );
}
