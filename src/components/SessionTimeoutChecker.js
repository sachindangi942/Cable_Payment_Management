import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

const SessionTimeoutChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const expiry = localStorage.getItem("sessionExpiry");

      if (expiry && Date.now() > Number(expiry)) {
        await auth.signOut();
        localStorage.clear();
        navigate("/login");
      }
    };

    // Check every 1 minute
    const interval = setInterval(checkSession, 60 * 1000);
    checkSession(); // initial check on mount

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default SessionTimeoutChecker;
