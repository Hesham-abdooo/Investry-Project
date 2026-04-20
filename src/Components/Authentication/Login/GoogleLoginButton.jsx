import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../../Api/axiosInstance";

export default function GoogleLoginButton({ onError, onSuccess, role }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const normalizedRole = role?.toLowerCase();

      const endpoint =
        normalizedRole === "founder"
          ? "/Auth/signin-google-founder"
          : "/Auth/signin-google-investor";
      const res = await axiosInstance.post(endpoint, { idToken });
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
