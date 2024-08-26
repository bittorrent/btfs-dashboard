import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import { useIntl } from 'react-intl';
import themeStyle from 'utils/themeStyle.js';
import { Tooltip, Form, Input, Button } from 'antd';
import { t } from 'utils/text.js';
import { aseEncode } from 'utils/BTFSUtil';

import { setLoginPassword,resetLoginPassword } from 'services/login.js';

const Endpoint = ({ endpoint, isReset }) => {
    // const { dispatch, state } = useContext(mainContext);
    // const { account } = state;
    const intl = useIntl();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const password = values.password;
        let psw = aseEncode(password, endpoint);
        if (isReset) {
            const privateKey = values.privateKey;
            resetPassword(privateKey, psw);
        } else {
            setPassoword(psw);
        }
    };

    const resetPassword = async (password,privateKey ) => {
        try {
            let res = await resetLoginPassword(privateKey,password);
            if (res) {
            }
        } catch (error) {}
    };

    const setPassoword = async password => {
        try {
            let res = await setLoginPassword(password);
            if (res) {
            }
        } catch (error) {}
    };

    const validatePwd = (rules, value, callback) => {
        let loginpass = form.getFieldValue('password');
        if (!loginpass) {
            callback(new Error(intl.formatMessage({ id: 'password_validate_required' })));
        }
        if (loginpass && loginpass !== value) {
            callback(new Error(intl.formatMessage({ id: 'password_re_enter_validate_pattern' })));
        } else {
            callback();
        }
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
                    form={form}
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    initialValues={{ endpoint }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item
                        label={<div className="font-bold theme-text-main">API {t('endpoint')}</div>}
                        name="endpoint">
                        <Input className="mr-2 common-input theme-bg theme-border-color" disabled />
                    </Form.Item>
                    {isReset && (
                        <Form.Item
                            label={<div className="font-bold theme-text-main">{t('enter_private_key')}</div>}
                            name="privateKey"
                            rules={[{ required: true, message: t('private_key_validate_required') }]}>
                            <Input.TextArea
                                rows={4}
                                placeholder="maxLength is 6"
                                className="mr-2 common-input theme-bg theme-border-color"
                                maxLength={6}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label={
                            <div>
                                <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                                    {t('enter_password')}
                                </h5>
                                <span className="text-sm font-medium theme-text-sub-info">
                                    {t('enter_password_desc')}
                                </span>
                            </div>
                        }
                        name="password"
                        rules={[
                            { required: true, message: t('password_validate_required') },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message: t('password_validate_pattern'),
                            },
                        ]}>
                        <Input.Password className="mr-2 common-input theme-bg theme-border-color" />
                    </Form.Item>
                    <Form.Item
                        label={<div className="font-bold theme-text-main">{t('re_enter_password')}</div>}
                        name="repassword"
                        rules={[
                            {
                                validator: (rules, value, callback) => {
                                    validatePwd(rules, value, callback);
                                },
                            },
                        ]}>
                        <Input.Password className="mr-2 common-input theme-bg theme-border-color" />
                    </Form.Item>
                    <Form.Item>
                        <button
                            className="mt-5 common-btn theme-common-btn login-btn"
                            type="primary"
                            // htmlType="submit"
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
