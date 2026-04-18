import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LogOutButton() {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token"); // جيب الـ token

    await axios.post(
      "https://investry.runasp.net/api/Auth/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // ابعته في الـ header
        },
      }
    );

    console.log("Logout success");
  } catch (err) {
    console.log("Logout error:", err.response?.data);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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