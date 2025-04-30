import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { CustomeModel } from "./customConfirmations/CustomeModel";

const SessionTimeoutChecker = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const expiry = localStorage.getItem("sessionExpiry");

            if (expiry && Date.now() > Number(expiry)) {
                setIsModalVisible(true)
                setTimeout (async()=>{
                    setIsModalVisible(false);
                    await auth.signOut();
                    localStorage.clear();
                    navigate("/login");
                },3000)
            }
        };

        // Check every 1 minute
        const interval = setInterval(checkSession, 60 * 1000);
        checkSession(); // initial check on mount

        return () => clearInterval(interval);
    }, [navigate]);

    return <CustomeModel
        title="session expire"
        visible={isModalVisible}
        description="Your session has expired. Please log in again."
        footer={null}
    >

    </CustomeModel>
};

export default SessionTimeoutChecker;
