import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({ onError, onSuccess, role }) {

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const endpoint = role === "founder"
        ? "https://investry.runasp.net/api/auth/signin-google-founder"
        : "https://investry.runasp.net/api/auth/signin-google-investor";

      const res = await axios.post(endpoint, { IdToken: idToken });
      const { token, roles } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", roles?.[0]);

      onSuccess({ token, roles });

    } catch (err) {
      // ✅ لو الايميل متسجل قبل كده
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message;
      if (msg?.toLowerCase().includes("already") || msg?.toLowerCase().includes("exist")) {
        onError("This Google account is already registered. Please login instead.");
      } else {
        onError("Google login failed. Please try again.");
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