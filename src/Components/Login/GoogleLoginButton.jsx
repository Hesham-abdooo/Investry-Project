import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton({ onError, onSuccess }) {

  const handleSuccess = async (credentialResponse) => {
    try {

      const idToken = credentialResponse.credential; // ده ال JWT الصح

      let res;

      try {
        res = await axios.post(
          "https://investry.runasp.net/api/auth/signin-google-founder",
          { IdToken: idToken }
        );
      } catch {
        res = await axios.post(
          "https://investry.runasp.net/api/auth/signin-google-investor",
          { IdToken: idToken }
        );
      }

      onSuccess(res.data.data);

    } catch (err) {
      onError("Google login failed. Please try again.");
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