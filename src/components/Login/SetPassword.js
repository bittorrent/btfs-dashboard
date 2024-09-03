import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import { aseEncode } from 'utils/BTFSUtil';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import { setLoginPassword, resetLoginPassword, login } from 'services/login.js';

const Endpoint = ({ endpoint, isReset }) => {
    const intl = useIntl();
    const history = useHistory();
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

    const resetPassword = async (password, privateKey) => {
        try {
            let res = await resetLoginPassword(privateKey, password);
            if (res && res.Success) {
                loginFn(password);
            } else {
                Emitter.emit('showMessageAlert', { message: res.Text, status: 'error' });
            }
        } catch (error) {}
    };

    const setPassoword = async password => {
        try {
            let res = await setLoginPassword(password);
            if (res && res.Success) {
                loginFn(password);
            } else {
                Emitter.emit('showMessageAlert', { message: res.Text, status: 'error' });
            }
        } catch (error) {
            Emitter.emit('showMessageAlert', { message: 'setting_error', status: 'error', type: 'frontEnd' });
        }
    };

    const loginFn = async password => {
        try {
            let res = await login(password);
            if (res && res.Success) {
                Cookies.set(endpoint, res.Text, { expires: 1});
                history.push('/admin/settings');
            } else {
                Emitter.emit('showMessageAlert', { message: res.Text || 'error', status: 'error' });
            }
        } catch (error) {
            Emitter.emit('showMessageAlert', { message: error.Message || 'error', status: 'error' });
        }
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
                    initialValues={{ endpoint }}
                    onFinish={onFinish}
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
                            rules={[
                                { required: true, message: t('private_key_validate_required') },
                                {
                                    pattern: /^[A-Fa-f0-9]{1,}$/,
                                    message: t('private_key_validate_pattern'),
                                },
                            ]}>
                            <Input.TextArea
                                rows={4}
                                placeholder={intl.formatMessage({
                                    id: 'reset_password_private_key_placeholder',
                                })}
                                className="mr-2 common-input theme-bg theme-border-color"
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
                                pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message: t('password_validate_pattern'),
                            },
                        ]}>
                        <Input.Password
                            placeholder={intl.formatMessage({ id: 'enter_password_placeholder' })}
                            className="mr-2 common-input theme-bg theme-border-color"
                        />
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
                        <Input.Password
                            placeholder={intl.formatMessage({ id: 're_enter_password_placeholder' })}
                            className="mr-2 common-input theme-bg theme-border-color"
                        />
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
