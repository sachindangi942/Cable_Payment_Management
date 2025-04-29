import { Modal } from 'antd';

export const CustomeModel = ({
  visible,
  onOk,
  onCancel,
  title,
  description,
  children,
  isEditModalVisible,
  handleUpdateProduct,
  handleCancelEdit
}) => {
  return (
    <Modal
      title={title || "Confirm Action"}
      open={visible}
      onOk={isEditModalVisible ? handleUpdateProduct : onOk}
      onCancel={isEditModalVisible ? handleCancelEdit : onCancel}
      okText={isEditModalVisible ? "update" : "yes Delete"}
      cancelText="Cancel"
    >
      {children}
      <p>{description || "Are you sure you want to proceed?"}</p>
    </Modal>
  );
};
