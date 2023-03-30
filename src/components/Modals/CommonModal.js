import React from 'react';
import { Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const CommonModal = ({ children, ...restProps }) => {
  return (
    <Modal {...restProps} centered closeIcon={<CloseCircleOutlined style={{ fontSize: 24 }} />} footer={null}>
      {children}
    </Modal>
  );
};

export default CommonModal;
