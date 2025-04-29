// hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return logout;
};

export default useLogout;
