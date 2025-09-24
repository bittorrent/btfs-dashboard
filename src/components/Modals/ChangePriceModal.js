import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
// import { useHistory } from 'react-router-dom';
// import { logout } from 'services/login.js';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Form, InputNumber } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import { setProxyPrice } from 'services/proxyService';

const maxPrice = 100000;

const defaultPrice = 125;

export default function ChangePriceModal({ color, fetchCurProxyPrice,curProxyPrice }) {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [isValid, setIsValid] = useState(true);
    // const history = useHistory();

    useEffect(() => {
        const set = async function (params) {
            let curProxyPrice = params.curProxyPrice || ''
            form.setFieldsValue({ newprice: curProxyPrice });
            // isOpenProxy.current = params.curProxyPrice;
            setLoading(false);
            openModal();
        };
        Emitter.on('openChangePriceModal', set);
        return () => {
            Emitter.removeListener('openChangePriceModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const openModal = () => {
        setShowModal(true);
        // form.resetFields();
        window.body.style.overflow = 'hidden';
    };

    const closeModal = (e) => {
        // e.preventDefault();
        setLoading(false);
        setShowModal(false);
        form.resetFields();
        window.body.style.overflow = '';
    };

    const onFinishFailed = errorInfo => {
        // setIsValid(false);
        // console.log('验证失败:', errorInfo);
    };

    const onFinish = async value => {
        const { newprice } = value;
        // setIsValid(true);
        setLoading(true);
        try {
            let res = await setProxyPrice(newprice);
            setLoading(false);
            if (res?.Type === 'error') {
                closeModal();
                Emitter.emit('showMessageAlert', {
                    message: res?.Message, //|| 'set_renew_on_fail'
                    status: 'error',
                });
                // Emitter.emit('showMessageAlert', {
                //     //         message: 'change_password_fail',
                //     //         status: 'error',
                //     //         type: 'frontEnd',
                //     //     });
                return;
            }
            fetchCurProxyPrice();
            console.log('-----22222')
            closeModal();
            Emitter.emit('showMessageAlert', {
                message: 'change_price_success',
                status: 'success',
                type: 'frontEnd',
            });
        } catch (e) {
            // Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
    };
    const validateNewPrice = (_, value) => {
        if (value && value < defaultPrice) {
            return Promise.reject(new Error(intl.formatMessage({ id: 'price_validate_min' })));
        }

        if (value && value > maxPrice) {
            return Promise.reject(new Error(intl.formatMessage({ id: 'price_validate_max' })));
        }
        if (value && !Number.isInteger(value)) {
            return Promise.reject(new Error(intl.formatMessage({ id: 'price_validate_integer' })));
        }
        return Promise.resolve();
    };

    const handleDefaultPrice = () => {
        form.setFieldsValue({ newprice: defaultPrice });
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center  theme-bg theme-text-main">
                    {
                        // <div className="font-semibold  text-base mb-6"> {t('change_price_modal')} </div>
                        // <main className="mb-8 theme-text-main">{t('change_price_modal_desc')}</main>
                    }

                    <header className="common-modal-header theme-text-main mb-2">
                        {t('change_price_modal')}
                    </header>
                    <main className="mb-4 text-xs font-medium mb-4 theme-text-sub-info">
                        {t('change_price_modal_desc')}
                    </main>
                    <Form
                        name="basic"
                        layout="vertical"
                        requiredMark={false}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Form.Item
                            name="newprice"
                            rules={[
                                { required: true, message: t('enter_new_price_placeholder') },
                                {
                                    validator: validateNewPrice,
                                },
                            ]}>
                            <InputNumber
                                className="common-input theme-bg theme-border-color"
                                placeholder={intl.formatMessage({
                                    id: 'enter_new_price_placeholder',
                                })}
                                // min={defaultPrice}
                                // max={maxPrice}
                                addonAfter={
                                    <div>
                                        <span className="mr-2 theme-text-sub-info">
                                            BTT(GB/{t('unit_day')})
                                        </span>
                                        <span
                                            className="theme-text-base cursor-pointer"
                                            onClick={handleDefaultPrice}>
                                            {t('default_price')}
                                        </span>
                                    </div>
                                }
                            />
                        </Form.Item>
                        <Form.Item className="mb-0">
                            <div className="mt-2 flex justify-end">
                                <button
                                    className="ml-2 common-btn theme-fill-gray text-gray-900 mr-2"
                                    onClick={closeModal}
                                    htmltype="button">
                                    {t('cancel')}
                                </button>
                                <div className="ml-2 inline-block">
                                    <Spin
                                        spinning={loading}
                                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                        <button
                                            type="primary"
                                            htmltype="submit"
                                            className="common-btn theme-common-btn">
                                            {t('change')}
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
