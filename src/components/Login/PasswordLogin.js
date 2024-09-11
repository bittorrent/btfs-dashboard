import React, {useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {useHistory } from 'react-router-dom';
import {  Form, Input } from 'antd';
import { t } from 'utils/text.js';
import { aseEncode } from 'utils/BTFSUtil';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

import Emitter from 'utils/eventBus';

import { login } from 'services/login.js';

const PasswordLogin = ({ color, endpoint }) => {
    const history = useHistory();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [times, setTimes] = useState(0);
    const [isLock, setIsLock] = useState(false);
    const [validateMsg, setValidateMsg] = useState('');

    const onFinish = async (values: any) => {
        if (isLock) return;
        let password = values.password;
        let psw = aseEncode(password, endpoint);
        let res = await login(psw);
        if (res && res.Success) {
            Cookies.set(endpoint, res.Text, { expires: 1 });
            history.push('/admin/settings');
        } else {
            setTimes(times + 1);
            Emitter.emit('showMessageAlert', { message: res.Text || 'error', status: 'error' });
        }
    };

    const LostPassword = () => {
        Emitter.emit('handleLostPassword');
    };

    const backPrevious = ()=>{
        Emitter.emit('showEndpoint');
    }

    useEffect(() => {
        if (times >= 5) {
            setIsLock(true);
        }
    }, [times]);

    useEffect(() => {
        let timer = null;
        if (isLock) {
            setValidateMsg(t('login_lock_message'));
            timer = setTimeout(() => {
                setIsLock(false);
            }, 180000);
        } else {
            setValidateMsg('');
            setTimes(0);
        }
        return () => clearInterval(timer);
    }, [isLock]);

    return (
        <div className="flex flex-col justify-center max-w-450px  min-w-334px login-form-w ">
            <div className="min-h-400">
                <div className="login-title mb-12 theme-text-main"><span onClick={backPrevious}  className='cursor-pointer pr-2'><ArrowLeftOutlined style={{ fontSize: 20 }}  className='align-middle' /></span>{t('login_title')}</div>
                <Form
                    name="basic"
                    layout="vertical"
                    form={form}
                    requiredMark={false}
                    className="login-form-w-334px"
                    // labelCol={{ span: 24 }}
                    initialValues={{ endpoint }}
                    onFinish={onFinish}
                    autoComplete="off">
                    <Form.Item
                        label={<div className="font-bold theme-text-main">API {t('endpoint')}</div>}
                        name="endpoint">
                        <Input className="mr-2 common-input theme-text-desc theme-base-bg border-none" disabled />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="w-full flex justify-between ">
                                <h5 className="font-bold theme-text-main shrink-0" htmlFor="grid-password">
                                    {t('login_password')}
                                </h5>
                                <span
                                    className="text-sm font-medium  theme-text-base cursor-pointer"
                                    onClick={LostPassword}>
                                    {t('lost_password')}
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
                        className="mr-2 common-input theme-bg theme-border-color theme-text-main" />
                    </Form.Item>
                    <div className="flex justify-between  w-full mt-2 ml-1 ">
                        <span className="theme-text-error text-sm pt-1">{validateMsg}</span>
                    </div>
                    <Form.Item>
                        <button className="mt-5 common-btn theme-common-btn login-btn" type="primary">
                            {t('next')}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default PasswordLogin;
