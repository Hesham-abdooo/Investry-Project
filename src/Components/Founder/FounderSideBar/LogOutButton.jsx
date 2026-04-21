import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";

export default function LogOutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        "/Auth/logout",

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-50 w-full"
    >
      <FaSignOutAlt size={16} />
      Log Out
    </button>
  );
}
