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
        console.log(values,'-------aaaa');
    };

    return (
        <div className="flex flex-col justify-center max-w-515px">
            <div className=" min-h-400">
                <div className="login-title">{t('set_login_password')}</div>
                <div className="text-gray-900 text-sm font-bold mb-12">{t('set_login_password_desc')}</div>

                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark={false}
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    // initialValues={{ remember: true }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item
                        label={<div className="font-bold theme-text-main">API {t('endpoint')}</div>}
                        name="endpoint"
                        >
                        <Input
                            defaultValue="http://localhost:5001"
                            className="mr-2 common-input theme-bg theme-border-color"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label={<div className="font-bold theme-text-main">{t('enter_private_key')}</div>}
                        name="enter_private_key"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input.TextArea
                            rows={4}
                            placeholder="maxLength is 6"
                            className="mr-2 common-input theme-bg theme-border-color"
                            maxLength={6}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div>
                                <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                                    {t('enter_password')}
                                </h5>
                                <span className='text-sm font-medium theme-text-sub-info'>{t('enter_password_desc')}</span>
                            </div>
                        }
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password className="mr-2 common-input theme-bg theme-border-color" />
                    </Form.Item>
                    <Form.Item
                        label={<div className="font-bold theme-text-main">{t('re_enter_password')}</div>}
                        name="repassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password className="mr-2 common-input theme-bg theme-border-color" />
                    </Form.Item>
                    <Form.Item>
                        <button
                            className="mt-5 common-btn theme-common-btn login-btn"
                            type="primary"
                             htmlType="submit"
                            >
                            {t('next')}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Endpoint;
