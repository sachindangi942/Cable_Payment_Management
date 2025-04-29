
import { Drawer, Modal, Tooltip, } from 'antd'
import { LogoutOutlined, } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { logoutUser } from '../../utils/Logout';
import { useState } from 'react';

export const CustomDrawer = ({ closeDrawer, isDrawerVisible }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        logoutUser();
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    return (
        <>
            <Drawer
                title="setting"
                placement="right"
                onClose={closeDrawer}
                open={isDrawerVisible}
                className="fw-bold"
            >
                <Tooltip
                    title="Logout Here ?"
                >
                    <Link className='text-danger pointer'
                        onClick={() => showModal()}
                    >
                        Logout <LogoutOutlined />
                    </Link>
                </Tooltip>
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
