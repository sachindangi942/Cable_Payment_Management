
import { Drawer, Tooltip, } from 'antd'
import { LogoutOutlined, } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { logoutUser } from '../../utils/Logout';

export const CustomDrawer = ({ closeDrawer, isDrawerVisible }) => {
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
                        onClick={() => logoutUser()}
                    >
                        Logout <LogoutOutlined />
                    </Link>
                </Tooltip>
            </Drawer>
        </>
    )
}
