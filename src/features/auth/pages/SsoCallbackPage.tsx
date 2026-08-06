import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/react";
import { notify } from "../../../lib/notify";

export default function SsoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription =
      searchParams.get("error_description") || searchParams.get("error_reason");

    if (error) {
      notify({
        success: false,
        message: errorDescription || "Inicio de sesión cancelado",
      });
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return <AuthenticateWithRedirectCallback />;
}
