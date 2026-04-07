import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton({ onError, onSuccess }) {

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const idToken = tokenResponse.id_token;
      try {
        let res;
        try {
          res = await axios.post(
            "https://investry.runasp.net/api/auth/signin-google-founder",
            { idToken }
          );
        } catch {
          res = await axios.post(
            "https://investry.runasp.net/api/auth/signin-google-investor",
            { idToken }
          );
        }
        onSuccess(res.data.data);
      } catch {
        onError("Google login failed. Please try again.");
      }
    },
    onError: () => onError("Google login failed. Please try again."),
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
    >
      <FcGoogle className="text-lg" />
      Google
    </button>
  );
}