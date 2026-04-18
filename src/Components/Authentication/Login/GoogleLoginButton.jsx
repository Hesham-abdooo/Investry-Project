import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({ onError, onSuccess, role }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const endpoint =
        role === "founder"
          ? "https://investry.runasp.net/api/Auth/signin-google-founder"
          : "https://investry.runasp.net/api/Auth/signin-google-investor";
      const res = await axios.post(endpoint, { idToken });
      const { token, roles } = res.data.data;

      localStorage.setItem("token", token);
      const roleName = roles?.[0] || role;
      localStorage.setItem("role", roleName);
      onSuccess({ token, roles });
    } catch (err) {
      console.log("Google Error:", err.response?.data);

      // ✅ لو الايميل متسجل قبل كده
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "";

      if (msg.includes("entity changes")) {
        onError(
          "This email is already registered with another role. Please login instead.",
        );
      } else {
        onError(msg || "Google login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Google login failed. Please try again.")}
      />
    </div>
  );
}
