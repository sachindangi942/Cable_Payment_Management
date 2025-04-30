
import { Drawer, Modal, Tooltip, } from 'antd'
import { LogoutOutlined, UnlockOutlined, } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/Logout';
import { useState } from 'react';

export const CustomDrawer = ({ closeDrawer, isDrawerVisible }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        closeDrawer();
        logoutUser(navigate);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
        closeDrawer();
    }
    return (
        <>
            <Drawer
                title="settings"
                placement="right"
                onClose={closeDrawer}
                open={isDrawerVisible}
                className="fw-bold"
            >
                <div className="d-flex flex-column gap-3">
                    <Tooltip title="Change password">
                        <Link to="/changepassword" 
                        onClick={closeDrawer}
                        >
                            Change Password <UnlockOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Logout Here?">
                        <div
                            onClick={showModal}
                            className="text-danger pointer"
                            style={{ cursor: "pointer" }}
                        >
                            Logout <LogoutOutlined />
                        </div>
                    </Tooltip>
                </div>
            </Drawer>
            <Modal
                title="Are you sure you want to Logout ? "
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <p>Click Yes to confirm Logout.</p>
            </Modal>
        </>
    )
}
