import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import { Dropdown, Menu } from 'antd';
import themeStyle from 'utils/themeStyle.js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Form, Input, Button } from 'antd';
import { Truncate } from 'utils/text.js';
import { t } from 'utils/text.js';
import ClipboardCopy from 'components/Utils/ClipboardCopy';

const Endpoint = ({ color }) => {
    // const { dispatch, state } = useContext(mainContext);
    // const { account } = state;

    const onFinish = (values: any) => {
        console.log(values, '-------aaaa');
    };

    return (
        <div className="flex flex-col justify-center max-w-515px  min-w-334px">
            <div className="min-h-400">
                <div className="login-title">{t('set_login_password')}</div>
                <div className="text-gray-900 text-sm font-bold mb-12">{t('set_login_password_desc')}</div>

                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark={false}
                    // labelWrap={true}
                    labelCol={{ span: 24 }}
                    // wrapperCol={{ span: 16 }}
                    // initialValues={{ remember: true }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item
                        label={<div className="font-bold theme-text-main">API {t('endpoint')}</div>}
                        name="endpoint">
                        <Input
                            defaultValue="http://localhost:5001"
                            className="mr-2 common-input theme-bg theme-border-color"
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="w-full flex justify-between ">
                                <h5 className="font-bold theme-text-main shrink-0" htmlFor="grid-password">
                                    {t('login_password')}
                                </h5>
                                <span className="text-sm font-medium  theme-text-base">
                                    {t('lost_password')}
                                </span>
                            </div>
                        }
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password className="mr-2 common-input theme-bg theme-border-color" />
                    </Form.Item>
                    <Form.Item>
                        <button
                            className="mt-5 common-btn theme-common-btn login-btn"
                            type="primary"
                            htmlType="submit">
                            {t('next')}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Endpoint;
