import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Form, Input } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import { changePassword } from 'services/login';
import Cookies from 'js-cookie';
import { aseEncode } from 'utils/BTFSUtil';

export default function ChangePasswordModal({ color }) {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            setLoading(false);
            openModal();
        };
        Emitter.on('openChangePasswordModal', set);
        return () => {
            Emitter.removeListener('openChangePasswordModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = () => {
        setShowModal(true);
        form.resetFields();
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setLoading(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const onFinish = async value => {
        const { oldpassword, password } = value;
        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';

        let asePassowrd = aseEncode(password, NODE_URL);
        let aseOldPassowrd = aseEncode(oldpassword, NODE_URL);
        setLoading(true);
        const token = Cookies.get(NODE_URL);
        try {
            let res = await changePassword(aseOldPassowrd, asePassowrd, token);
            setLoading(false);
            if (res && res.Success) {
                Emitter.emit('showMessageAlert', {
                    message: 'change_password_success',
                    status: 'success',
                    type: 'frontEnd',
                });
                closeModal();
            } else {
                Emitter.emit('showMessageAlert', {
                    message: 'change_password_fail',
                    status: 'error',
                    type: 'frontEnd',
                });
            }
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
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
    const validateNewPassword = (rules, value, callback) => {
        let oldpassword = form.getFieldValue('oldpassword');
        if (oldpassword && oldpassword === value) {
            callback(new Error(intl.formatMessage({ id: 'same_as_old_password' })));
        } else {
            callback();
        }
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center  theme-bg theme-text-main">
                    <div className="font-semibold  text-base mb-6"> {t('change_password_modal')} </div>
                    <Form
                        name="basic"
                        layout="vertical"
                        requiredMark={false}
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off">
                        <Form.Item
                            label={
                                <div className="font-bold theme-text-main">API {t('enter_old_password')}</div>
                            }
                            name="oldpassword"
                            rules={[
                                { required: true, message: t('private_key_validate_required') },
                                {
                                    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                    message: t('password_validate_pattern'),
                                },
                            ]}>
                            <Input.Password
                                className="mr-2 common-input theme-bg theme-border-color"
                                placeholder={intl.formatMessage({
                                    id: 'enter_old_password_placeholder',
                                })}
                            />
                        </Form.Item>
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
                                {
                                    validator: (rules, value, callback) => {
                                        validateNewPassword(rules, value, callback);
                                    },
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
                        <Form.Item className="mb-0">
                            <div className="mt-2 flex justify-end">
                                <button
                                    className="ml-2 common-btn theme-fill-gray text-gray-900 mr-2"
                                    onClick={closeModal}>
                                    {t('cancel_encrypt_file_btn')}
                                </button>
                                <div className="ml-2 inline-block">
                                    <Spin
                                        spinning={loading}
                                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                        <button type="primary" className="common-btn theme-common-btn">
                                            {t('next')}
                                        </button>
                                    </Spin>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </main>
            </div>
        </CommonModal>
    );
}
